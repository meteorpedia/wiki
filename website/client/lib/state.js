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
 * @type {string}
 * @const
 */
SESSION_PAGE_ID = 'pageId';

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
  return formatPageName_(name);
}
formattedPageName = formattedPageName_;

/**
 * @param {string} name
 * @return {string}
 */
function formatPageName_(name) {
  return name.split('_').join(' ');
}
formatPageName = formatPageName_;

/**
 * @return {string}
 */
function pageType_() {
  return Session.get(SESSION_PAGE_TYPE);
}
pageType = pageType_;

/**
 * @return {string}
 */
function pageId_() {
  return Session.get(SESSION_PAGE_ID);
}
pageId = pageId_;
