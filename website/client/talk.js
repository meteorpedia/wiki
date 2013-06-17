/**
 * @fileOverview The wiki read controller.
 */

var TP, SESSION_TALK_ERROR, SESSION_TALK_EDIT_ID;

/**
 * @type {string}
 * @const
 */
SESSION_TALK_ERROR = 'talk-error';

/**
 * @type {string}
 * @const
 */
SESSION_TALK_EDIT_ID = 'talk-edit-id'


/**
 * @constructor
 * @extends {View}
 */
function Talk_() {
  this.init_();
}
Talk_.prototype = _.clone(View);
TP = Talk_.prototype;

/**
 * @type {string}
 */
TP.name = 'talk';

/**
 * @param {string} pageName
 * @protected
 * @return {string}
 */
TP.pathGenerator_ = function(pageName) {
  return [this.name, pageName].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @protected
 */
TP.render = function(state, viewName, pageName) {
  Session.set(SESSION_PAGE_NAME_KEY, pageName);
  Session.set(SESSION_PAGE_TYPE, viewName);
};

Talk = Talk_;

/**
 * @return {string}
 */
Template.talk.pageTitle = function() {
  return formattedPageName();
};

/**
 * @return {Array.<Object>}
 */
Template.talk.messages = function() {
  var messages, docs;
  messages = [];
  docs = WikiMessages.find({pageId: pageId()}, {sort: {created: -1}});
  docs.forEach(function(msg) {
    console.log('msg', msg);
    messages.push({
      who: msg.userId,
      created: new Date(msg.created).toLocaleString(),
      formattedContent: msg.formattedContent
    });
  });
  console.log('m', messages);
  return messages;
};

/**
 * @return {boolean}
 */
Template.talk.hasError = function() {
  return !!Session.get(SESSION_TALK_ERROR);
};

/**
 * @return {string}
 */
Template.talk.error = function() {
  return Session.get(SESSION_TALK_ERROR);
};

Template.talk.events({
  'submit form#message-form': handleSubmit
});

/**
 * @param {Object} event
 */
function handleSubmit(event) {
  var message, id;
  event.preventDefault();
  message = $('#discuss-message-textarea').val();
  message = $.trim(message);
  if (_.isEmpty(message)) {
    Session.set(SESSION_TALK_ERROR, 'Message cannot be empty.');
    return;
  }
  id = pageId();
  if (!id) {
    Session.set(SESSION_TALK_ERROR, 'This page has not been created yet.');
    return;
  }
  Session.set(SESSION_TALK_ERROR, '');
  Meteor.call('talk', id, message, Session.get(SESSION_TALK_EDIT_ID),
    handleDiscuss);
}

/**
 * @param {Object} response
 */
function handleDiscuss(err, response) {
  if (!err && response.success) {
    $('#discuss-message-textarea').val('');
    Session.set(SESSION_TALK_ERROR, '');
    Session.set(SESSION_TALK_EDIT_ID, '');
    return;
  }
  response = response || {};
  Session.set(SESSION_TALK_ERROR, response.error || 'Failed to send message');
}

