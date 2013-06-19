/**
 * Base view from which all the other views inherit.
 */

/**
 * @type {Object}
 */
View = {
  /**
   * @protected
   */
  init_: function() {
    this.template = Template[this.name];
    window.router.addRoute(this.name, this);
  },
  /**
   * Let the view know it's being rendered.
   * @param {Object} state
   * @param {*=} opt_args
   * @protected
   */
  render: function(state, opt_args) {
  },
  /**
   * Generate a path for a view.
   * @return {string}
   */
  pathGenerator: function() {
    return this.pathGenerator_.apply(this, arguments);
  },
  /**
   * Run the router for this view. Only used to tell router how to generate
   * route for view. Don't put logic in this as it wont be available
   * to history when user loads page from URL or clicks back button.
   * @param {*=} opt_args
   */
  run: function(opt_args) {
  },
  /**
   * Clean up any stuff that needs to be in the view.
   */
  dispose: function() {}
};
