/**
 * @fileOverview The router for the app.
 */

var routes, RP, history, ROUTE_SESSION_KEY, SESSION_LOADING;
//var loaders = [];  // stack of loading functions
loaders = [];

/**
 * @type {string}
 * @const
 */
ROUTE_SESSION_KEY = 'routeName';

/**
 * @type {string}
 * @const
 */
SESSION_LOADING = 'loading';

history = window.history;

/**
 * @param {string} routeName
 * @param {View} view
 * @constructor
 */
function Route(routeName, view) {
  /**
   * @type {string}
   */
  this.routeName = routeName;
  /**
   * @type {View}
   */
  this.view = view;
  /**
   * @type {Function}
   */
  this.dispose = _.bind(view.dispose, view);
  /**
   * @type {Function}
   */
  this.callback = _.bind(view.render, view);
  /**
   * @type {Function}
   */
  this.template = view.template;
  /**
   * @type {Function}
   */
  this.pathGenerator = _.bind(view.pathGenerator, view);
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
  /**
   * @type {Route}
   * @private
   */
  this.currentRoute_ = null;
  window.addEventListener('popstate', _.bind(this.handlePop_, this));
}
RP = Router_.prototype;

/**
 * @param {string} routeName
 * @param {View} view
 */
RP.addRoute = function(routeName, view) {
  routes[routeName] = new Route(routeName, view);
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
  if (!_.isNull(this.currentRoute_)) {
    this.currentRoute_.dispose();
  }
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
  this.currentRoute_ = route;
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

/**
 * return {string}
 */
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
 * @return {boolean}
 */
Handlebars.registerHelper('loading', function() {
  var loading = false;
  for (sub in allSubs) {
    if (!allSubs[sub].ready()) {
      loading = true;
    }
  }
  return loading;
});

/**
 * @param {Object} event
 * @private
 */
RP.handlePop_ = function(event) {
  var state, route, path, paths, routeName, args;

  // See "Note-1" below why we need this
  if (event.state === null && hasPoppedEver) return;
  if (!hasPoppedEver) hasPoppedEver = true;

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
  this.currentRoute_ = route;
  args = [state].concat(paths);
  this.runTemplate(routeName, route.callback, args);
};


Router = Router_;

/*
 * Note-1
 *
 * As per https://developer.mozilla.org/en-US/docs/Web/API/window.onpopstate:
 * Browsers tend to handle the popstate event differently on page load.
 * Chrome and Safari always emit a popstate event on page load, but Firefox doesn't.
 *
 * We do the little hackery below to correctly route to the first page in Firefox:
 *
 * 1) Keep track of whether or not we've ever had a popstate event before
 * 2) Manually call handlePop_ on page load, but ensure it doesn't run twice.
 *    CONSEQUENTLY ANY OTHER EVENTS WITH event.state=null WILL BE IGNORED.
 *    That's fine for the default behaviour of the router, but be aware of it.
 */
var hasPoppedEver = false;
var oldOnLoad = window.onload;
window.onload = function(event) {
  event.state = null;
  window.router.handlePop_(event);
  history.replaceState({}, '', location.href);
}
