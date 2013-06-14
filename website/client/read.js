/**
 * @fileOverview The wiki read controller.
 */

var RP;

/**
 * @constructor
 * @extends {View}
 */
function Read_() {
  this.init_();
}
Read_.prototype = _.clone(View);
RP = Read_.prototype;

/**
 * @type {string}
 */
RP.name = 'read';

/**
 * @param {string} pageName
 * @protected
 * @return {string}
 */
RP.pathGenerator_ = function(pageName) {
  return [this.name, pageName].join('/');
};

Read = Read_;

Template.read.text = function() {
  return 'This is text.';
};
