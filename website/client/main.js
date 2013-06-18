var activeViews, views, SITE_NAME;

/**
 * @type {Array.<View>}
 */
activeViews = [Read, Edit, Talk, History, EditProfile];

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
  _.each(activeViews, function(view) {
    views.push(new view());
  });
}

Deps.autorun(function() {
  document.title = [formattedPageName(), '-', SITE_NAME].join(' ');
});

Deps.autorun(function() {
  Meteor.subscribe('currentPage', pageName());
});
Deps.autorun(function() {
  Meteor.subscribe('recentEdits', pageId());
});
Deps.autorun(function() {
  Meteor.subscribe('recentMessages', pageId());
});

Meteor.startup(function() {
  Deps.autorun(function() {
    var page;
    page = WikiPages.findOne({name: pageName()});
    if (page) {
      Session.set(SESSION_PAGE_ID, page._id);
    }
  });
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

Template.header.events({
  'click a.brand': function(event) {
    event.preventDefault();
    window.router.run('read', ['Main_Page'], [{}, 'read', 'Main_Page']);
  }
});

Meteor.startup(main);