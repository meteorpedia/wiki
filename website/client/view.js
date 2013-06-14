/**
 * Base view from which all the other views inherit.
 */

/**
 * @type {Object}
 */
View = {
  /**
   * @param {View
   */
  init: function(view) {
    _.extend(view, View);
    view.setupRoute_();
  },
  /**
   * @private
   */
  setupRoute_: function() {
    this.template = Template[this.name];
    window.router.addRoute(this.name, _.bind(this.render, this), this.template,
     _.bind(this.pathGenerator_, this));
  },
  /**
   * Let the view know it's being rendered.
   * @param {Object} state
   * @param {*=} opt_args
   */
  render: function(state, opt_args) {
  },
  /**
   * Generate a path for a view.
   * @private
   * @return {string}
   */
  pathGenerator_: function() {
    return '';
  },
  /**
   * Run the router for this view. Only used to tell router how to generate
   * route for view. Don't put logic in this as it wont be available
   * to history when user loads page from URL or clicks back button.
   * @param {*=} opt_args
   */
  run: function(opt_args) {
  }
};
