Meteor.methods({
  /*
   * Get the country of the client.
   * @return country The country which the IP address of the client is in.
   */
  'phoneformat.getCountryForIp': function () {
    var response = null;

    // Lookup info for the client's IP address, not the server's
    var clientIP = this.connection.clientAddress;

    // If phoneformat is configured with a token, do the look up over https
    if (Phoneformat.token) {
      response = HTTP.get('https://ipinfo.io/' + clientIP + '?token=' + Phoneformat.token);
    } else {
      response = HTTP.get('http://ipinfo.io/' + clientIP);
    }

    return response.data && response.data.country;
  }
});

Phoneformat = {};

// Configure phoneformat to use https with a token
Phoneformat.configure = function (options) {
  options = options || {};

  Phoneformat.token = options.token;
};
