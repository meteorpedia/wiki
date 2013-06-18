/**
 * @fileOverview Profile view and other profile specific logic like profile
 * links.
 */

var HASH_LEN, SESSION_PROFILE_CACHE_KEY;

/**
 * @type {number}
 * @const
 */
HASH_LEN = 6;

/**
 * @type {string}
 * @const
 */
SESSION_PROFILE_CACHE_KEY = 'profile-profiles-cache';

/**
 * @param {string} userId
 * @param {Object} userMap
 * @return {string}
 */
function profileInfo_(userId, userMap) {
  var user;
  if (_.has(userMap, userId)) {
    user = userMap[userId];
  } else {
    user = {name: 'Anonymous'};
  }
  return {
    userId: userId,
    userHash: userId.substr(0, HASH_LEN),
    userName: user.name
  };
}
profileInfo = profileInfo_;

/**
 * @param {string} pgName
 * @param {string} sessionKey
 * @param {string} methodName
 * @param {Meteor.Collection} collection
 */
function createProfileFetcher_(pgName, sessionKey, methodName, collection) {
  return function() {
    var id, userMapCache;
    userMapCache = Session.get(SESSION_PROFILE_CACHE_KEY) || {};
    if (pageType() !== pgName) {
      Session.set(sessionKey, {});
      return;
    }
    id = pageId();
    if (collection.find({pageId: id}).count() > 0) {
      if (_.has(userMapCache, id)) {
        Session.set(sessionKey, userMapCache[id]);
      }
      Meteor.call(methodName, id, function(err, response) {
        var userMapCache;
        // Getting it again because maybe it changed.
        userMapCache = Session.get(SESSION_PROFILE_CACHE_KEY) || {};
        if (err || !response || !response.userMap) {
          return Session.set(sessionKey, {});
        }
        userMapCache[response.pageId] = response.userMap;
        if (pageId() === response.pageId) {
          Session.set(sessionKey, response.userMap);
        }
        Session.set(SESSION_PROFILE_CACHE_KEY, userMapCache);
      });
    }
  };
}
createProfileFetcher = createProfileFetcher_;
