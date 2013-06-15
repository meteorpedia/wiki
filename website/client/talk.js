/**
 * @fileOverview The wiki read controller.
 */

var TP;

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

