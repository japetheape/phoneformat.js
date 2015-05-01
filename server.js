Meteor.methods({
  'phoneformat.getCountryForIp': function () {
    var response = null;

    if (Phoneformat.token) {
      response = HTTP.get('https://ipinfo.io?token=' + Phoneformat.token);
    } else {
      response = HTTP.get('http://ipinfo.io');
    }

    return response.data && response.data.country;
  }
});

Phoneformat = {};

Phoneformat.configure = function (options) {
  options = options || {};

  Phoneformat.token = options.token;
};
