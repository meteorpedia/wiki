Deps.autorun(function () {
});

var views = [];

function main() {
  var r;
  r = new Router('read', ['Main_Page']);
  views.push(new Read());
  views.push(new Edit());
  views.push(new Talk());
}

Meteor.startup(main);
