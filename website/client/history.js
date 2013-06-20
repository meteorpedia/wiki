/**
 * @fileOverview The wiki read controller.
 */

var HP, SESSION_EDIT_USER_MAP, SESSION_EDIT_TS;

/**
 * @type {string}
 * @const
 */
SESSION_EDIT_USER_MAP = 'edit-user-map';

/**
 * @type {string}
 * @const
 */
SESSION_EDIT_TS = 'edit-timestamp';

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
 * @param {string=} opt_ts
 * @protected
 * @return {string}
 */
HP.pathGenerator_ = function(pageName, opt_ts) {
  if (_.isUndefined(opt_ts)) {
    return [this.name, pageName].join('/');
  } else {
    return [this.name, pageName, opt_ts].join('/');
  }
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @param {string=} opt_ts Timestamp for which edit to show.
 * @protected
 */
HP.render = function(state, viewName, pageName, ts) {
  Session.set(SESSION_PAGE_NAME_KEY, pageName);
  Session.set(SESSION_PAGE_TYPE, viewName);
  if (_.isString(ts)) {
    Session.set(SESSION_EDIT_TS, parseInt(ts, 10));
  } else {
    Session.set(SESSION_EDIT_TS, null);
  }
};

/** @inheritDoc */
HP.dispose = function() {
  Session.set(SESSION_EDIT_TS, null);
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
      ts: edit.ts,
      pageId: pageName(),
      date: new Date(edit.ts).toLocaleString(),
      createdBy: profileInfo(edit.createdBy, userMap),
      publishedBy: profileInfo(edit.publishedBy, userMap),
      comment: edit.comment
    }
    edits.push(data);
  });
  return edits;
};

/**
 * @return {boolean}
 */
Template.history.showHistoricalEdit = function() {
  return !_.isNull(Session.get(SESSION_EDIT_TS));
};

/**
 * @return {string}
 */
Template.history.historicalEditContent = function() {
  var edit;
  edit = WikiEdits.findOne({ts: Session.get(SESSION_EDIT_TS)});
  if (!edit) {
    return 'Not found.';
  }
  return edit.formattedContent;
};

Template.history.events({
  'click a.internal-link': handleHistoryInternalLink
});

/**
 * @param {Object} event
 */
function handleHistoryInternalLink(event) {
  var el, type, ts, name;
  el = $(event.target);
  type = el.attr('data-type');
  if (type === 'history') {
    event.preventDefault();
    ts = el.attr('data-ts');
    if (ts) {
      name = pageName();
      window.router.run('history', [name, ts], [{}, 'history', name, ts]);
    }
  }
}
