/**
 * @fileOverview The wiki read controller.
 */

var RP;

/**
 * @constructor
 * @extends {View}
 */
function Read_() {
  this.init_();
}
Read_.prototype = _.clone(View);
RP = Read_.prototype;

/**
 * @type {string}
 */
RP.name = 'read';

/**
 * @param {string} pageName
 * @protected
 * @return {string}
 */
RP.pathGenerator_ = function(pageName) {
  return [this.name, pageName].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @protected
 */
RP.render = function(state, viewName, pageName) {
  Session.set(SESSION_PAGE_NAME_KEY, pageName);
};

Read = Read_;

Template.read.text = function() {
  return 'This is text.';
};
