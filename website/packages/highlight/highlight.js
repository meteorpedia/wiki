/**
 * @fileOverview Creates a highlighter for JavaScript.
 */
var nsh, language;

nsh =  Npm.require('node-syntaxhighlighter');
language = nsh.getLanguage('js')

/**
 * @param {string} code
 * @return {string}
 */
function highlight_(code) {
  return nsh.highlight(code, language);
}
highlight = highlight_;


