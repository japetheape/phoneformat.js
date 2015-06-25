Package.describe({
  name: 'dispatch:phoneformat.js',
  summary: 'phoneformat.js packaged for meteor',
  version: '1.3.0',
  git: 'https://github.com/DispatchMe/phoneformat.js.git',
});

Package.onUse(function (api) {
  api.use([
    // core
    'reactive-var@1.0.5',
    'templating@1.1.1',

    // atmosphere
    'raix:eventemitter@0.1.2'
  ], 'web');

  api.addFiles([
    'google.phoneformat.js',
    'phoneformat.js',
    'country_code_map.js',
    'components/single-input/single_input.html',
    'components/single-input/single_input.css',
    'components/single-input/single_input.js',
    'components/multi-input/multi_input.html',
    'components/multi-input/multi_input.css',
    'components/multi-input/multi_input.js',
    'components/phone_input.js'
  ], 'web');

  api.use([
    'http@1.1.0'
  ], 'server');

  api.addFiles('server.js', 'server');

  api.export(['Phoneformat', 'PhoneInput']);
});

Cordova.depends({
  'org.apache.cordova.globalization': '0.3.4'
});
