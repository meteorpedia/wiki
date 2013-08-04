/**
 * @fileOverview Handles the page menu for this wiki.
 */

/**
 * @param {Object} event
 */
function handleInternalClick_(event) {
  var pageType, name, el;
  event.preventDefault();
  el = $(event.target);
  pageType = el.attr('data-link');
  name = el.attr('data-name');
  window.router.run(pageType, [name], [{}, pageType, name]);
}
handleInternalClick = handleInternalClick_;

/**
 * @param {Object} event
 */
function handleProfileClick_(event) {
  event.preventDefault();
  window.router.run('edit_profile', [{}, 'edit_profile']);
}

Template.pageMenu.events({
  'click a.internal-link': handleInternalClick_,
  'click a.edit-profile-link': handleProfileClick_
});

/**
 * @return {boolean}
 */
Template.pageMenu.isPage = function() {
  return !!pageName();
};

/**
 * @return {string}
 */
Template.pageMenu.pageName = function() {
  return pageName();
};
/**
 * @return {boolean}
 */
Template.pageMenu.isProfile = function() {
  return pageType() === 'edit_profile';
};

/**
 * @return {boolean}
 */
Template.pageMenu.isEdit = function() {
  return pageType() === 'edit';
};

/**
 * @return {boolean}
 */
Template.pageMenu.isHistory = function() {
  return pageType() === 'history';
};

/**
 * @return {boolean}
 */
Template.pageMenu.isRead = function() {
  return pageType() === 'read';
};

/**
 * @return {boolean}
 */
Template.pageMenu.isTalk = function() {
  return pageType() === 'talk';
};

Template.pageMenu.talkCount = function() {
  return WikiMessages.find({pageId: pageId()}).count();
}
