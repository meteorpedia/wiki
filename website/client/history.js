/**
 * @fileOverview The wiki read controller.
 */

var HP, SESSION_HISTORY_USER_MAP, SESSION_HISTORY_TS, SESSION_HISTORY_PREV,
  SESSION_HISTORY_NEXT;

/**
 * @type {string}
 * @const
 */
SESSION_HISTORY_PREV = 'history-previous';

/**
 * @type {string}
 * @const
 */
SESSION_HISTORY_NEXT = 'history-next';

/**
 * @type {string}
 * @const
 */
SESSION_HISTORY_USER_MAP = 'history-user-map';

/**
 * @type {string}
 * @const
 */
SESSION_HISTORY_TS = 'history-timestamp';

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
    Session.set(SESSION_HISTORY_TS, parseInt(ts, 10));
  } else {
    Session.set(SESSION_HISTORY_TS, null);
  }
};

/** @inheritDoc */
HP.dispose = function() {
  Session.set(SESSION_HISTORY_TS, null);
};

History = History_;

Meteor.startup(function() {
  // In startup because it uses createProfileFetcher, defined elsewhere.
  Deps.autorun(createProfileFetcher(HP.name, SESSION_HISTORY_USER_MAP,
    'historyProfiles', WikiEdits));
});

Deps.autorun(function() {
  var edits, prev, next, found, ts;
  ts = Session.get(SESSION_HISTORY_TS);
  edits = WikiEdits.find({pageId: pageId()}, {sort: {ts: 1}});
  edits.forEach(function(edit) {
    if (edit.ts === ts) {
      found = true;
      return;
    }
    if (!found) {
      prev = edit;
      return;
    }
    if (!next) {
      next = edit;
    }
  });
  Session.set(SESSION_HISTORY_PREV, prev ? prev.ts : null);
  Session.set(SESSION_HISTORY_NEXT, next ? next.ts : null);
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
    userMap = Session.get(SESSION_HISTORY_USER_MAP) || {};
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

Template.history.events({
  'click a.internal-link': handleHistoryInternalLink
});

/**
 * @return {boolean}
 */
Template.historicalEdit.showHistoricalEdit = function() {
  return !_.isNull(Session.get(SESSION_HISTORY_TS));
};

/**
 * @return {string}
 */
Template.historicalEdit.data = function() {
  var edit, userMap;
  userMap = Session.get(SESSION_HISTORY_USER_MAP) || {};
  edit = WikiEdits.findOne({ts: Session.get(SESSION_HISTORY_TS)});
  if (!edit) {
    return {formattedContent: 'Not found.'};
  }
  return {
    author: profileInfo(edit.createdBy, userMap),
    date: new Date(edit.ts).toLocaleString(),
    comment: edit.comment,
    formattedContent: edit.formattedContent
  };
};

Template.historicalEdit.events({
  'click a.internal-action': handleHistoryInternalAction
});

/**
 * @return {number}
 */
Template.historicalEdit.previous = function() {
  return Session.get(SESSION_HISTORY_PREV);
};

/**
 * @return {number}
 */
Template.historicalEdit.next = function() {
  return Session.get(SESSION_HISTORY_NEXT);
};

/**
 * @param {Object} event
 */
function handleHistoryInternalAction(event) {
  var type, name;
  name = pageName();
  event.preventDefault();
  type = $(event.target).attr('data-action');
  if (type === 'close') {
    window.router.run('history', [name], [{}, 'history', name]);
  }
  if (type === 'previous' || type === 'next') {
    handleHistoryNavEvent(event);
  }
};


/**
 * @param {Object} event
 */
function handleHistoryInternalLink(event) {
  var el, type, ts, name;
  el = $(event.target);
  type = el.attr('data-type');
  if (type === 'history') {
    event.preventDefault();
    handleHistoryNavEvent(event);
  }
}


/**
 * @param {Object} event
 */
function handleHistoryNavEvent(event) {
  var el;
  el = $(event.target);
  ts = el.attr('data-ts');
  if (ts) {
    name = pageName();
    window.router.run('history', [name, ts], [{}, 'history', name, ts]);
  }
}
