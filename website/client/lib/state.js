/**
 * @fileOverview Application state utilities.
 */

/**
 * @type {string}
 * @const
 */
SESSION_PAGE_NAME_KEY = 'currentPage';

/**
 * @type {string}
 * @const
 */
SESSION_PAGE_TYPE = 'pageType';

/**
 * @return {string}
 */
function pageName_() {
  return Session.get(SESSION_PAGE_NAME_KEY);
}
pageName = pageName_;

/**
 * @return {string}
 */
function formattedPageName_() {
  var name;
  name = Session.get(SESSION_PAGE_NAME_KEY) || '';
  return name.split('_').join(' ');
}
formattedPageName = formattedPageName_;

/**
 * @return {string}
 */
function pageType_() {
  return Session.get(SESSION_PAGE_TYPE);
}
pageType = pageType_;
