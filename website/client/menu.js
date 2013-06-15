/**
 * @fileOverview Handles the page menu for this wiki.
 */

/**
 * @param {Object} event
 */
function handleClick(event) {
  var pageType, name;
  event.preventDefault();
  pageType = $(event.target).attr('data-link');
  name = pageName();
  window.router.run(pageType, [name], [{}, pageType, name]);
}

Template.pageMenu.events({
  'click a': handleClick
});

/**
 * @return {string}
 */
Template.pageMenu.pageName = function() {
  return pageName();
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
Template.pageMenu.isRead = function() {
  return pageType() === 'read';
};

/**
 * @return {boolean}
 */
Template.pageMenu.isTalk = function() {
  return pageType() === 'talk';
};


