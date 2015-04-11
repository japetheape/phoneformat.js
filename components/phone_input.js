var countryVar = new ReactiveVar();
var dialCodeVar = new ReactiveVar();

Template.InternationalPhoneInput.helpers({
  dialCode: function () {
    return dialCodeVar.get();
  },
  exampleCountryNumber: function () {
    var country = countryVar.get();
    if (!country) return '';

    var exampleNumber = Phone.exampleMobileNumber(country);
    var intlNumber = Phone.formatInternational(country, exampleNumber);

    return intlNumber.replace(/[0-9]/g, 'X');
  }
});

Template.InternationalPhoneInput.events({
  'blur .dial-code': function (event) {
    var currentValue = event.currentTarget.value;

    if (!currentValue) event.currentTarget.value = dialCodeVar.get();
  },
  'input .phone-number': function (event) {
    var currentValue = event.currentTarget.value;
    var dialCode = $('.dial-code').val();

    var cleanPhone = Phone.cleanPhone(dialCode + currentValue);

    if (cleanPhone.length > 15) currentValue = currentValue.substring(0, currentValue.length - 1);

    var country = countryVar.get();

    event.currentTarget.value = Phone.formatInternational(country, currentValue);
  }
});

Template.InternationalPhoneInput.created = function () {
  Phone._getCountryFromIP(function (country) {
    countryVar.set(country);

    var countryName = Phone.countryCodeToName(country);

    var countryInfo = COUNTRY_CODE_MAP[countryName];
    dialCodeVar.set(countryInfo.dial_code);
  });
};

Template.InternationalPhoneInput.value = function (excludeDialCode) {
  var phoneNumber = $('.phone-number').val();
  var dialCode = $('.dial-code').val();

  phoneNumber = Phone.cleanPhone(phoneNumber);

  if (dialCode.indexOf('+') === -1) dialCode = '+' + dialCode;

  return (excludeDialCode) ? phoneNumber : dialCode + phoneNumber;
};
