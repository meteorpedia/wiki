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
 * @constructor
 */
function Router_() {
  window.router = this;
  /**
   * @param {string}
   * @private
   */
  this.defaultPath_ = null;
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
 * @param {Object=} opt_state
 */
RP.run = function(routeName, pathGenArgs, opt_state) {
  var route, state;
  route = routes[routeName];
  state = {routeName: routeName};
  if (_.isObject(opt_state)) {
    state = _.extend(state, opt_state);
  }
  history.push(state, routeName, route.pathGenerator.apply(route, pathGenArgs));
  this.runTemplate(routeName, route.callback, callbackArgs);
}

/**
 * @param {string} defaultPath
 */
RP.setDefaultPath = function(defaultPath) {
  this.defaultPath_ = defaultPath;
};

/**
 * @param {string} routeName
 * @param {Function} callback
 * @param {Array} callbackArgs
 * @param {Object} state
 */
RP.runTemplate = function(routeName, callback, callbackArgs, state) {
  callback.call(null, state, callbackArgs);
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
  var state, route, path, paths, routeName;
  state = event.state || {};
  path = window.location.pathname || '';
  if (!path) {
    if (!this.defaultPath_) {
      return;
    }
    path = this.defaultPath_;
  }
  path = path.substr(1);
  paths = path.split('/');
  routeName = _.first(paths);
  route = routes[routeName];
  this.runTemplate(routeName, route.callback, paths, state);
};


Router = Router_;
