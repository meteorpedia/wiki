var views, SITE_NAME;

/**
 * @type {Array}
 */
views = [];

/**
 * @type {string}
 * @const
 */
SITE_NAME = 'Meteorpedia';

function main() {
  var r;
  r = new Router('read', ['Main_Page'], [{}, 'read', 'Main_Page']);
  views.push(new Read());
  views.push(new Edit());
  views.push(new Talk());
  views.push(new History());
}

Deps.autorun(function() {
  document.title = [formattedPageName(), '-', SITE_NAME].join(' ');
});

Deps.autorun(function() {
  Meteor.subscribe('currentPage', pageName());
  Meteor.subscribe('recentEdits', pageId());
});

Deps.autorun(function() {
  var page;
  page = WikiPages.findOne({name: pageName()});
  if (page) {
    Session.set(SESSION_PAGE_ID, page._id);
  }
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
