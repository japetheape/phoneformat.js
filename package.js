Package.describe({
  name: 'dispatch:phoneformat.js',
  summary: 'phoneformat.js packaged for meteor',
  version: '1.0.0',
  git: 'https://github.com/DispatchMe/phoneformat.js.git',
  // meteor cannot process the README.md
  documentation: null
});

Package.onUse(function (api) {
  api.addFiles('PhoneFormat.js', 'web');

  api.export('Phone', 'web');
});
