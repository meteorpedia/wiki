Package.describe({
  summary: 'Meteor smart package for the highlighting js.'
});

Npm.depends({
  'node-syntaxhighlighter': '0.8.1'
});

Package.on_use(function (api) {
  api.add_files('highlight.js', ['server']);
});

