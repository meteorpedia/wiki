/**
 * @fileOverview Profile view and other profile specific logic like profile
 * links.
 */

var HASH_LEN;

/**
 * @type {number}
 * @const
 */
HASH_LEN = 6;

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
