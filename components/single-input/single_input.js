Template.InternationalPhoneSingleInput.helpers({
  dialCode: function () {
    var input = PhoneInput(this.id);
    if (!input.getPhoneNumber()) return;

    return input.getDialCode() + ' ';
  },
  phoneNumber: function () {
    var input = PhoneInput(this.id);
    var phoneNumber = input.getPhoneNumber();
    var countryCode = input.getCountryCode();

    return Phoneformat.formatInternational(countryCode, phoneNumber);
  },
  exampleCountryNumber: function () {
    var input = PhoneInput(this.id);
    var countryCode = input.getCountryCode();

    var exampleNumber = Phoneformat.exampleMobileNumber(countryCode);
    var intlNumber = Phoneformat.formatInternational(countryCode, exampleNumber);

    if (this.hideDialCode) return intlNumber.replace(/[0-9]/g, 'X');

    var dialCode = input.getDialCode();
    return dialCode + ' ' + intlNumber.replace(/[0-9]/g, 'X');
  },
  maxPhoneNumberLength: function () {
    return PhoneInput(this.id).maxLength();
  }
});

Template.InternationalPhoneSingleInput.events({
  'input .js-intlSinglePhone--phoneNumber': function (event, template) {
    var input = PhoneInput(template.data.id);
    var currentValue = Phoneformat.cleanPhone(event.currentTarget.value);

    // Set the phone number on the phone input object.
    if (template.data.hideDialCode) {
      input.setPhoneNumber(currentValue);
    } else {
      input.setValue(currentValue);
    }
  }
});
