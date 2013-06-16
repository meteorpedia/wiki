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

Template.pageMenu.events({
  'click a.internal-link': handleInternalClick_
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


