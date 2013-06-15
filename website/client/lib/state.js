/**
 * @fileOverview Application state utilities.
 */

/**
 * @type {string}
 * @const
 */
SESSION_PAGE_NAME_KEY = 'currentPage';

/**
 * @return {string}
 */
function pageName_() {
  return Sessoin.get(SESSION_PAGE_NAME_KEY);
}
pageName = pageName_;

/**
 * @return {string}
 */
function formattedPageName_() {
  return Session.get(SESSION_PAGE_NAME_KEY).split('_').join(' ');
}
formattedPageName = formattedPageName_;

