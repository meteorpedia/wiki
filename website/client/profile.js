/**
 * @fileOverview Profile view and other profile specific logic like profile
 * links.
 */

var HASH_LEN, SESSION_PROFILE_CACHE_KEY, SESSION_PROFILE_ID, PP;

/**
 * @type {string}
 * @const
 */
SESSION_PROFILE_ID = 'profileId';

Deps.autorun(function(c) {
  var userId;
  userId = Session.get(SESSION_PROFILE_ID);
  Meteor.subscribe('profileView', userId);
  Meteor.subscribe('messagesForUser', userId);
  Meteor.subscribe('editsForUser', userId);
});


/**
 * @constructor
 * @extends {View}
 */
function Profile_() {
  this.init_();
}
Profile_.prototype = _.clone(View);
PP = Profile_.prototype;

/**
 * @type {string}
 */
PP.name = 'profile';

/**
 * @protected
 * @return {string}
 */
PP.pathGenerator_ = function() {
  return [this.name].join('/');
};

/**
 * @param {Object} state
 * @param {string} viewName
 * @param {string} profileId
 * @protected
 */
PP.render = function(state, viewName, profileId) {
  Session.set(SESSION_PAGE_TYPE, viewName);
  Session.set(SESSION_PROFILE_ID, profileId);
};

/** @inheritDoc */
PP.dispose = function() {
  Session.set(SESSION_PROFILE_ID, null);
};

Profile = Profile_;

/**
 * @return {Object}
 */
Template.profile.user = function() {
  var user, userId, map, profile;
  userId = Session.get(SESSION_PROFILE_ID);
  user = Meteor.users.findOne(userId) || {};
  map = {};
  map[userId] = user.profile || {};
  return profileInfo_(userId, map);
}

/**
 * @return Object
 */
Template.profile.edits = function() {
  var edits;
  edits = {
    header: 'Recent edits',
    items: []
  };
  WikiEdits.find({createdBy: Session.get(SESSION_PROFILE_ID)},
    {sort: {ts: -1}}).forEach(function(edit) {
    edits.items.push({
      pageType: 'history',
      pageId: edit.pageName,
      pageName: formatPageName(edit.pageName || ''),
      message: edit.comment,
      when: new Date(edit.ts).toLocaleString()
    });
  });
  return edits;
}

/**
 * @return Object
 */
Template.profile.messages = function() {
  var messages;
  messages = {
    header: 'Recent messages',
    items: []
  };
  WikiMessages.find({userId: Session.get(SESSION_PROFILE_ID)},
    {sort: {created: -1}}).forEach(function(msg) {
    messages.items.push({
      pageType: 'talk',
      pageId: msg.pageName,
      pageName: formatPageName(msg.pageName || ''),
      message: msg.formattedContent,
      when: new Date(msg.created).toLocaleString()
    });
  });
  return messages;
}



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
