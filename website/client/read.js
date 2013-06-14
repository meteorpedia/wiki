/**
 * @fileOverview The wiki read controller.
 */

var RP;

/**
 * @constructor
 * @extends {View}
 */
function Read_() {
  View.init(this);
}
RP = Read_.prototype;

/**
 * @type {string}
 */
RP.name = 'read';

Read = Read_;

Template.read.text = function() {
  return 'This is text.';
};
