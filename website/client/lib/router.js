/**
 * @fileOverview The router for the app.
 */

var routes, RP, history, ROUTE_SESSION_KEY;

/**
 * @type {string}
 * @const
 */
ROUTE_SESSION_KEY = 'routeName';


history = window.history;

/**
 * @param {string} routeName
 * @param {Function} callback
 * @param {Function} template
 * @param {function} pathGenerator
 * @constructor
 */
function Route(routeName, callback, template, pathGenerator) {
  /**
   * @type {string}
   */
  this.routeName = routeName;
  /**
   * @type {Function}
   */
  this.callback = callback;
  /**
   * @type {Function}
   */
  this.template = template;
  /**
   * @type {Function}
   */
  this.pathGenerator = pathGenerator;
}

/**
 * A map of callbacks for routes.
 * @type {Object.<string, Route>}}
 */
routes = {};


/**
 * @param {string} defaultRouteName
 * @param {Array=} opt_defaultRouteArgs
 * @param {Array=} opt_defaultCallbackArgs
 * @constructor
 */
function Router_(defaultRouteName, opt_defaultRouteArgs,
    opt_defaultCallbackArgs) {
  window.router = this;
  /**
   * @type {string}
   * @private
   */
  this.defaultRouteName_ = defaultRouteName;
  /**
   * @type {Array}
   * @private
   */
  this.defaultRouteArgs_ = opt_defaultRouteArgs || [];
  /**
   * @type {Array}
   * @private
   */
  this.defaultCallbackArgs_ = opt_defaultCallbackArgs || [];
  window.addEventListener('popstate', _.bind(this.handlePop_, this));
}
RP = Router_.prototype;

/**
 * @param {string} routeName
 * @param {Function} pathGenerator
 * @param {Function} callback
 * @param {Function} template
 */
RP.addRoute = function(routeName, pathGenerator, template, callback) {
  routes[routeName] = new Route(routeName, pathGenerator, template, callback);
};

/**
 * @param {string} routeName
 * @param {Array} pathGenArgs
 * @param {Array} callbackArgs
 * @param {Object=} opt_state
 * @param {boolean=} opt_replace
 */
RP.run = function(routeName, pathGenArgs, callbackArgs, opt_state,
    opt_replace) {
  var route, state;
  route = routes[routeName];
  state = {routeName: routeName};
  if (_.isObject(opt_state)) {
    state = _.extend(state, opt_state);
  }
  if (opt_replace === true) {
    history.replaceState(state, routeName,
      '/' + route.pathGenerator.apply(route, pathGenArgs));
  } else {
    history.pushState(state, routeName,
      '/' + route.pathGenerator.apply(route, pathGenArgs));
  }
  this.runTemplate(routeName, route.callback, callbackArgs);
}

/**
 * @param {string} routeName
 * @param {Function} callback
 * @param {Array} callbackArgs
 * @param {Object} state
 */
RP.runTemplate = function(routeName, callback, callbackArgs) {
  callback.apply(null, callbackArgs);
  Session.set(ROUTE_SESSION_KEY, ''); // Force session update.
  Session.set(ROUTE_SESSION_KEY, routeName);
};

/** @inheritDoc */
Template.main.content = function() {
  var routeName, route, template;
  routeName = Session.get(ROUTE_SESSION_KEY);
  if (!routeName || _.isEmpty(routes)) {
    return;
  }
  route = routes[routeName];
  return route.template();
};

/**
 * @param {Object} event
 * @private
 */
RP.handlePop_ = function(event) {
  var state, route, path, paths, routeName, args;
  state = event.state || {};
  path = window.location.pathname || '';
  path = path.substr(1);
  if (!path) {
    if (this.defaultRouteName_ && this.defaultRouteArgs_) {
      this.run(this.defaultRouteName_, this.defaultRouteArgs_,
        this.defaultCallbackArgs_, {}, true);
    }
    return;
  }
  paths = path.split('/');
  routeName = _.first(paths);
  route = routes[routeName];
  if (!route) {
    //TODO: add a 404 page.
    return;
  }
  args = [state].concat(paths);
  this.runTemplate(routeName, route.callback, args);
};


Router = Router_;
