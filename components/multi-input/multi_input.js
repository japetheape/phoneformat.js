Template.InternationalPhoneMultiInput.helpers({
  dialCode: function () {
    return PhoneInput(this.id).getDialCode();
  },
  phoneNumber: function () {
    var input = PhoneInput(this.id);
    var phoneNumber = input.getPhoneNumber();
    var countryCode = input.getCountryCode();

    return Phoneformat.formatInternational(countryCode, phoneNumber);
  },
  exampleCountryNumber: function () {
    var countryCode = PhoneInput(this.id).getCountryCode();

    var exampleNumber = Phoneformat.exampleMobileNumber(countryCode);
    var intlNumber = Phoneformat.formatInternational(countryCode, exampleNumber);

    return intlNumber.replace(/[0-9]/g, 'X');
  },
  maxPhoneNumberLength: function () {
    return PhoneInput(this.id).maxLength();
  }
});

Template.InternationalPhoneMultiInput.events({
  'input .js-intlMultiPhone--dialCode': function (event, template) {
    var currentValue = event.currentTarget.value;

    // Ensure that the dial code starts with a '+'.
    if (currentValue.substring(0, 1) !== '+') currentValue = '+' + currentValue;

    var dialCode = Phoneformat.dialCodeToName(currentValue);
    var country = COUNTRY_CODE_MAP[dialCode];
    if (!country) return;

    // Update country code var if a country exists for the current dial code.
    PhoneInput(template.data.id).setCountryCode(country.code);
  },
  'input .js-intlMultiPhone--phoneNumber': function (event, template) {
    var currentValue = Phoneformat.cleanPhone(event.currentTarget.value);

    // Set the phone number on the phone input object.
    PhoneInput(template.data.id).setPhoneNumber(currentValue);
  }
});
