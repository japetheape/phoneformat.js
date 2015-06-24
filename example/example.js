if (Meteor.isServer) return;

Template.example.helpers({
  countries: function () {
    var countryList = Phoneformat.countryList();
    var countries = [];

    _.each(countryList, function (value, key) {
      countries.push({ name: key, countryCode: value.code });
    });

    return countries;
  }
});

Template.example.events({
  'change .js-countrySelector1': function (event) {
    var countryCode = event.currentTarget.value;

    PhoneInput('testMulti1').setCountryCode(countryCode);
  },
  'change .js-countrySelector2': function (event) {
    var countryCode = event.currentTarget.value;

    PhoneInput('testMulti2').setCountryCode(countryCode);
  }
});
