/* global PhoneInput:true */

var _phoneInputs = {};

PhoneInput = function (id, options) {
  if (!id) throw new Meteor.Error('Please specify an id for the phone input');

  var self = this;

  if (_phoneInputs[id]) return _phoneInputs[id];

  if (!(self instanceof PhoneInput)) return new PhoneInput(id, options);

  // Set up an event emitter for tracking changes.
  self._emitter = new EventEmitter();
  self.emit = self._emitter.emit.bind(self._emitter);
  self.on = self._emitter.on.bind(self._emitter);
  self.removeListener = self._emitter.removeListener.bind(self._emitter);

  options = options || {};

  self.type = options.type;
  self.storeInput = options.storeInput || false;
  self.hideDialCode = self.type === 'single' && options.hideDialCode;

  self.countryCode = new ReactiveVar(options.countryCode);
  self.dialCode = new ReactiveVar();
  self.phoneNumber = new ReactiveVar();

  _phoneInputs[id] = self;

  // If storeInput is true, listen for changes and store them in local storage.
  if (self.storeInput) {
    self.on('change', function () {
      localStorage.setItem('phoneformat.inputs.' + id, self.getValue());
    });
  }

  // Set the country code based on the user's IP address if it was not specified in the options.
  if (!self.countryCode.get()) {
    Phoneformat._getCountryForIp(function (countryCode) {
      self.setCountryCode(countryCode);
    });
  }
};

PhoneInput.prototype.getCountryCode = function () {
  return this.countryCode.get();
};

PhoneInput.prototype.setCountryCode = function (countryCode) {
  if (!countryCode) return;

  var prevCountryCode = this.countryCode.get();

  this.countryCode.set(countryCode);

  // Emit a change event if the country code exists and is being changed.
  if (prevCountryCode && prevCountryCode !== countryCode) {
    this.emit('change', { countryCode: countryCode });
  }

  var dialCode = Phoneformat.countryCodeToDialCode(countryCode);
  this.setDialCode(dialCode);
};

PhoneInput.prototype.getDialCode = function () {
  return this.dialCode.get();
};

PhoneInput.prototype.setDialCode = function (dialCode) {
  var prevDialCode = this.dialCode.get();

  this.dialCode.set(dialCode);

  // Emit a change event if the dial code exists and is being changed.
  if (prevDialCode && prevDialCode !== dialCode) {
    this.emit('change', { dialCode: dialCode });
  }
};

PhoneInput.prototype.getPhoneNumber = function () {
  return this.phoneNumber.get();
};

PhoneInput.prototype.setPhoneNumber = function (phoneNumber) {
  var prevPhoneNumber = this.phoneNumber.get();

  this.phoneNumber.set(phoneNumber);

  // Emit a change event if the phone number exists and is being changed.
  if (prevPhoneNumber && prevPhoneNumber !== phoneNumber) {
    this.emit('change', { phoneNumber: phoneNumber });
  }
};

PhoneInput.prototype.getValue = function () {
  var dialCode = this.getDialCode();
  var phoneNumber = this.getPhoneNumber();

  // Remove all special characters except for '+'.
  return Phoneformat.cleanPhone(dialCode + phoneNumber);
};

PhoneInput.prototype.setValue = function (newValue) {
  if (!newValue) return;

  var newDialCode = Phoneformat.phoneNumberToDialCode(newValue);
  var newCountryCode = Phoneformat.dialCodeToCountryCode(newDialCode);
  this.setCountryCode(newCountryCode);

  var newPhoneNumber = newValue.substring(newDialCode.length);
  this.setPhoneNumber(newPhoneNumber);
};

PhoneInput.prototype.maxLength = function () {
  // Limit the length of a phone number to the length of an example number from that country.
  var countryCode = this.getCountryCode();
  var exampleNumber = Phoneformat.exampleMobileNumber(countryCode);
  var formattedNumber = Phoneformat.formatInternational(countryCode, exampleNumber);

  // Multi inputs only limit the phone number input length to the length of the formatted number.
  if (this.type === 'multi' || this.hideDialCode) return formattedNumber.length;

  // Single inputs must also include the dial code and the space between the dial code and phone number.
  var dialCode = this.getDialCode();
  return (dialCode + ' ' + formattedNumber).length;
};

Template.InternationalPhoneSingleInput.onCreated(function () {
  var options = _.extend({}, this.data, { type: 'single' });
  var input = PhoneInput(this.data.id, options);

  // Append the template view to the input object
  input.view = this.view;

  // If store input is set to true, update the input value with the stored value.
  if (input.storeInput) {
    var storedValue = localStorage.getItem('phoneformat.inputs.' + this.data.id);
    input.setValue(storedValue);
  }
});

Template.InternationalPhoneMultiInput.onCreated(function () {
  var options = _.extend({}, this.data, { type: 'multi' });
  var input = PhoneInput(this.data.id, options);

  // Append the template view to the input object
  input.view = this.view;

  // If store input is set to true, update the input value with the stored value.
  if (input.storeInput) {
    var storedValue = localStorage.getItem('phoneformat.inputs.' + this.data.id);
    input.setValue(storedValue);
  }
});
