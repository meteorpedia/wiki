/**
 * @fileOverview The wiki read controller.
 */

var EP, SESSION_PROFILE_ERROR;

/**
 * @type {string}
 * @const
 */
SESSION_PROFILE_ERROR = 'profile-error';


/**
 * @constructor
 * @extends {View}
 */
function EditProfile_() {
  this.init_();
}
EditProfile_.prototype = _.clone(View);
EP = EditProfile_.prototype;

/**
 * @type {string}
 */
EP.name = 'edit_profile';

/**
 * @protected
 * @return {string}
 */
EP.pathGenerator_ = function() {
  return [this.name].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} pageName
 * @protected
 */
EP.render = function(state, viewName, pageName) {
  Session.set(SESSION_PAGE_TYPE, viewName);
};

EditProfile = EditProfile_;

