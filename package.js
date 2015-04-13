Package.describe({
  name: 'dispatch:phoneformat.js',
  summary: 'phoneformat.js packaged for meteor',
  version: '1.0.0',
  git: 'https://github.com/DispatchMe/phoneformat.js.git',
});

Package.onUse(function (api) {
  api.use([
    'reactive-var', 'templating'
  ], 'web');

  api.addFiles([
    'phoneformat.js',
    'phone.js',
    'country_code_map.js',
    'components/phone_input.html', 'components/phone_input.css', 'components/phone_input.js'
  ], 'web');

  api.export('Phone', 'web');
});
