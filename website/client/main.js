Deps.autorun(function () {
});

var views = [];

function main() {
  var r;
  r = new Router();
  views.push(new Read());
  views.push(new Edit());
  views.push(new Talk());
}

Meteor.startup(main);
