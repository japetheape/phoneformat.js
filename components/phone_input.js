var countryCodeVar = new ReactiveVar('US');
var dialCodeVar = new ReactiveVar('+1');

Template.InternationalPhoneInput.helpers({
  dialCode: function () {
    return dialCodeVar.get();
  },
  exampleCountryNumber: function () {
    var country = countryCodeVar.get();
    if (!country) return '';

    var exampleNumber = Phoneformat.exampleMobileNumber(country);
    var intlNumber = Phoneformat.formatInternational(country, exampleNumber);

    return intlNumber.replace(/[0-9]/g, 'X');
  }
});

Template.InternationalPhoneInput.events({
  'input .js-intlPhone--dialCode': function (event) {
    var currentValue = event.currentTarget.value;

    // Ensure that the dial code starts with a '+'
    if (currentValue.substring(0, 1) !== '+') currentValue = '+' + currentValue;

    dialCodeVar.set(currentValue);

    var country = COUNTRY_CODE_MAP[Phoneformat.dialCodeToName(currentValue)];
    if (!country) return;

    // Update country code var if a country exists for the current dial code
    countryCodeVar.set(country.code);

    // Trigger phone number input to apply formatting to current phone number
    $('.js-intlPhone--phoneNumber').trigger('input');
  },
  'input .js-intlPhone--phoneNumber': function (event) {
    var currentValue = event.currentTarget.value;

    var country = countryCodeVar.get();

    var exampleNumber = Phoneformat.exampleMobileNumber(country);
    var cleanPhone = Phoneformat.cleanPhone(currentValue);

    // Limit the length of a phone number to the length of an example number from that country
    if (cleanPhone.length > exampleNumber.length) currentValue = cleanPhone.substring(0, exampleNumber.length);

    event.currentTarget.value = Phoneformat.formatInternational(country, currentValue);
  }
});

Template.InternationalPhoneInput.created = function () {
  Phoneformat._getCountryForIp(function (countryCode) {
    countryCodeVar.set(countryCode);

    var dialCode = Phoneformat.countryCodeToDialCode(countryCode);
    dialCodeVar.set(dialCode);
  });
};

Template.InternationalPhoneInput.dialCode = function (newDialCode) {
  // Set the dial code input value and trigger the input event
  // to apply the correct mask to the phone number input
  if (newDialCode) $('.js-intlPhone--dialCode').val(newDialCode).trigger('input');

  var dialCode = dialCodeVar.get();
  if (!dialCode) return;

  if (dialCode.indexOf('+') === -1) dialCode = '+' + dialCode;

  return dialCode;
};

Template.InternationalPhoneInput.phoneNumber = function (newPhoneNumber) {
  // Set the phone number input value and trigger the input event to apply the correct mask
  if (newPhoneNumber) $('.js-intlPhone--phoneNumber').val(newPhoneNumber).trigger('input');

  var phoneNumber = $('.js-intlPhone--phoneNumber').val();

  phoneNumber = Phoneformat.cleanPhone(phoneNumber);

  return phoneNumber;
};

Template.InternationalPhoneInput.value = function () {
  var dialCode = Template.InternationalPhoneInput.dialCode();
  var phoneNumber = Template.InternationalPhoneInput.phoneNumber();

  return dialCode + phoneNumber;
};
