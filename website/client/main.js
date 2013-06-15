var views, SITE_NAME;

/**
 * @type {Array}
 */
views = [];

/**
 * @type {string}
 * @const
 */
SITE_NAME = 'The Unofficial Meteor Wiki';

function main() {
  var r;
  r = new Router('read', ['Main_Page'], [{}, 'read', 'Main_Page']);
  views.push(new Read());
  views.push(new Edit());
  views.push(new Talk());
}

Deps.autorun(function() {
  document.title = [formattedPageName(), '-', SITE_NAME].join(' ');
});

/**
 * @return {string}
 */
Template.header.title = function() {
  return SITE_NAME;
};

/**
 * @return {string}
 */
Template.pageTitle.pageName = function() {
  return formattedPageName();
};

/**
 * @return {string}
 */
Template.pageTitle.siteName = function() {
  return SITE_NAME;
};

Meteor.startup(main);
