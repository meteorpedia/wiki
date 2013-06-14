/**
 * @fileOverview The wiki read controller.
 */

var TP;

/**
 * @constructor
 * @extends {View}
 */
function Talk_() {
  this.init_();
}
Talk_.prototype = _.clone(View);
TP = Talk_.prototype;

/**
 * @type {string}
 */
TP.name = 'talk';

Talk = Talk_;

