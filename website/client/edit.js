/**
 * @fileOverview The wiki read controller.
 */

var EP;

/**
 * @constructor
 * @extends {View}
 */
function Edit_() {
  View.init(this);
}
EP = Edit_.prototype;

/**
 * @type {string}
 */
EP.name = 'edit';

Edit = Edit_;

