/**
 * @fileOverview The wiki read controller.
 */

var EP;

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

