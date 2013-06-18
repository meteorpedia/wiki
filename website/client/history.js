/**
 * @fileOverview The wiki read controller.
 */

var HP, SESSION_EDIT_USER_MAP;

/**
 * @type {string}
 * @const
 */
SESSION_EDIT_USER_MAP = 'edit-user-map';

/**
 * @constructor
 * @extends {View}
 */
function History_() {
  this.init_();
}
History_.prototype = _.clone(View);
HP = History_.prototype;

/**
 * @type {string}
 */
HP.name = 'history';

/**
 * @param {string} pageName
 * @protected
 * @return {string}
 */
HP.pathGenerator_ = function(pageName) {
  return [this.name, pageName].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @protected
 */
HP.render = function(state, viewName, pageName) {
  Session.set(SESSION_PAGE_NAME_KEY, pageName);
  Session.set(SESSION_PAGE_TYPE, viewName);
};

History = History_;

Meteor.startup(function() {
  Deps.autorun(createProfileFetcher(HP.name, SESSION_EDIT_USER_MAP,
    'historyProfiles', WikiEdits));
});

/**
 * return {string}
 */
Template.history.pageTitle = function() {
  return formattedPageName();
};

/**
 * @return {Array}
 */
Template.history.edits = function() {
  var edits;
  edits = [];
  WikiEdits.find({pageId: pageId()}, {sort: {ts: -1}}).forEach(function(edit) {
    var data, userMap;
    userMap = Session.get(SESSION_EDIT_USER_MAP) || {};
    data = {
      date: new Date(edit.ts).toLocaleString(),
      createdBy: profileInfo(edit.createdBy, userMap),
      publishedBy: profileInfo(edit.publishedBy, userMap),
      comment: edit.comment
    }
    edits.push(data);
  });
  return edits;
};

