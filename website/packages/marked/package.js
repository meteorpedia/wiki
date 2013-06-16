Package.describe({
  summary: 'Meteor smart package for the marked node.js package'
});

Npm.depends({
  'marked': '0.2.9'
});

Package.on_use(function (api) {
  api.add_files('marked.js', ['server']);
});
