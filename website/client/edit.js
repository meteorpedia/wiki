/**
 * @fileOverview The wiki read controller.
 */

var EP;

/**
 * @constructor
 * @extends {View}
 */
function Edit_() {
  this.init_();
}
Edit_.prototype = _.clone(View);
EP = Edit_.prototype;

/**
 * @type {string}
 */
EP.name = 'edit';

Edit = Edit_;

