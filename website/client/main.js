var activeViews, views, SITE_NAME;

/**
 * @type {Array.<View>}
 */
activeViews = [Read, Edit, Talk, History, EditProfile, Profile, Articles];

Extensions.registerHookType('activeViews', '0.1.0');
activeViews = Extensions.runHookChain('activeViews', activeViews);

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

allSubs = {};

Deps.autorun(function() {
  allSubs.currentPage = Meteor.subscribe('currentPage', pageName());
});
Deps.autorun(function() {
  var limit = (pageType() == 'history') ? null : 1;  // null = use server default 
  allSubs.recentEdits = Meteor.subscribe('recentEdits', pageId(), limit);
});
Deps.autorun(function() {
// TODO, move to talk page, send minimal data over wire until talk page opened, etc.
//  if (pageType() == 'talk')
  allSubs.recentMessages = Meteor.subscribe('recentMessages', pageId());
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

/**
 * XXX: This needs to turn into an actual error view.
 */
function errorPage_() {
  alert('There was an error rendering your request.');
}
errorPage = errorPage_;

Meteor.startup(main);
