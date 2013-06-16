/**
 * @fileOverview The wiki read controller.
 */

var EP, SESSION_EDIT_ERROR, SESSION_EDIT_ERROR_DESC_PREFIX;

/**
 * @type {string}
 * @const
 */
SESSION_EDIT_ERROR = 'edit-error';

/**
 * @type {string}
 * @const
 */
SESSION_EDIT_ERROR_DESC_PREFIX = 'edit-error-desc-';

/**
 * @constructor
 * @extends {View}
 */
function Edit_() {
  this.init_();
}
Edit_.prototype = _.clone(View);
EP = Edit_.prototype;

/**
 * @type {string}
 */
EP.name = 'edit';

/**
 * @param {string} pageName
 * @protected
 * @return {string}
 */
EP.pathGenerator_ = function(pageName) {
  return [this.name, pageName].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @protected
 */
EP.render = function(state, viewName, pageName) {
  Session.set(SESSION_PAGE_NAME_KEY, pageName);
  Session.set(SESSION_PAGE_TYPE, viewName);
};

Edit = Edit_;

/**
 * return {string}
 */
Template.edit.pageTitle = function() {
  return formattedPageName();
};

/**
 * @return {string}
 */
Template.edit.buttonName = function() {
  var p, buttonName;
  p = WikiPages.findOne({_id: pageId()});
  if (p) {
    if (WikiEdits.findOne({_id: p.lastEditId})) {
      return 'Save';
    }
  }
  return 'Create';
};

/**
 * @return {boolean}
 */
Template.edit.cantEdit = function() {
  return !Meteor.userId();
};

/**
 * @return {boolean}
 */
Template.edit.hasPreviousError = function() {
  return Session.get(SESSION_EDIT_ERROR) === pageName();
};

/**
 * @return {string}
 */
Template.edit.previousErrorDescription = function() {
  return Session.get(SESSION_EDIT_ERROR_DESC_PREFIX + pageName())
    || 'Your edit failed without explanation.';
};

/**
 * @return {string}
 */
Template.edit.lastEdit = function() {
  var p;
  p = WikiPages.findOne(pageId());
  if (!p || !p.lastEditId) {
    return {};
  }
  return WikiEdits.findOne(p.lastEditId);
};

Template.edit.events({
  'submit form': handleSubmit
});

/**
 * @param {Object} event
 */
function handleSubmit(event) {
  var text, uid, id, name;
  event.preventDefault();
  uid = Meteor.userId();
  if (_.isNull(uid)) {
    return;
  }
  name = pageName();
  if (!name) {
    return;
  }
  id = pageId();
  text = $('#edit-contents').val();
  Meteor.call('edit', id, name, text, handleEditResponse);
}

/**
 * @param {Object} response
 */
function handleEditResponse(error, response) {
  var name, pageType;
  name = pageName();
  if (error || !response) {
    Session.set(SESSION_EDIT_ERROR, name);
    Session.set(SESSION_EDIT_ERROR_DESC_PREFIX + name, 'Failed submitting edit.');
  }
  if (response.success) {
    Session.set(SESSION_EDIT_ERROR, '');
    window.router.run('read', [name], [{}, 'read', name]);
    return;
  }
  Session.set(SESSION_EDIT_ERROR, name);
  Session.set(SESSION_EDIT_ERROR_DESC_PREFIX + name, response.error);
}
