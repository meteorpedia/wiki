Package.describe({
  summary: 'Meteor smart package for diffing.'
});

Package.on_use(function (api) {
  api.add_files('diff.js', ['client']);
});


