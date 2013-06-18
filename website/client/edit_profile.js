/**
 * @fileOverview The wiki read controller.
 */

var EP, SESSION_PROFILE_ERROR, SESSION_PROFILE_SAVED;

/**
 * @type {string}
 * @const
 */
SESSION_PROFILE_ERROR = 'profile-error';

/**
 * @type {string}
 * @const
 */
SESSION_PROFILE_SAVED = 'profile-saved';

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
  Session.set(SESSION_PROFILE_ERROR, '');
  Session.set(SESSION_PROFILE_SAVED, '');
};

EditProfile = EditProfile_;

/**
 * @return {string}
 */
Template.edit_profile.email = function() {
  var user, email;
  user = Meteor.user();
  if (!user) {
    return '';
  }
  email =_.first(user.emails);
  if (!email) {
    return '';
  }
  return email.address;
};

/**
 * @return {string}
 */
Template.edit_profile.profileName = function() {
  var user, profile;
  user = Meteor.user();
  if (!user) {
    return '';
  }
  profile = user.profile;
  if (!profile) {
    return '';
  }
  return profile.name || '';
};

/**
 * @return {booelan}
 */
Template.edit_profile.isLoggedIn = function() {
  return !!Meteor.userId();
};

/**
 * @return {boolean}
 */
Template.edit_profile.hasError = function() {
  return !!Session.get(SESSION_PROFILE_ERROR);
};

/**
 * @return {string}
 */
Template.edit_profile.error = function() {
  return Session.get(SESSION_PROFILE_ERROR);
};

/**
 * @return {boolean}
 */
Template.edit_profile.saved = function() {
  return Session.get(SESSION_PROFILE_SAVED);
};

Template.edit_profile.events({
  'submit form': handleSubmit
});

/**
 * @param {Object} event
 */
function handleSubmit(event) {
  var email, profileName;
  event.preventDefault();
  Session.set(SESSION_PROFILE_SAVED, false);
  if (!Meteor.userId()) {
    return Session.set(SESSION_PROFILE_ERROR, 'You are not logged in.');
  }
  profileName = $('#edit-profile-name-input').val();
  profileName = $.trim(profileName);
  if (_.isEmpty(profileName)) {
    return Session.set(SESSION_PROFILE_ERROR, 'Profile name cannot be blank.');
  }
  email = $('#edit-profile-email-input').val();
  email = $.trim(email);
  if (_.isEmpty(profileName)) {
    return Session.set(SESSION_PROFILE_ERROR, 'Profile email cannot be blank.');
  }
  Meteor.call('profile', profileName, email, handleProfileUpdate);
}

/**
 * @param {Object} err
 * @param {Object} response
 */
function handleProfileUpdate(err, response) {
  if (err || !response.success) {
    response = response || {};
    return Session.set(
      SESSION_PROFILE_ERROR, response.error || 'Failed to update profile.');
  }
  Session.set(SESSION_PROFILE_ERROR, '');
  Session.set(SESSION_PROFILE_SAVED, true);
}
