var RECENT_EDIT_LIMIT, RECENT_MESSAGE_LIMIT;

/**
 * @type {number}
 * @const
 */
RECENT_EDIT_LIMIT = 300;

/**
 * @type {number}
 * @const
 */
RECENT_MESSAGE_LIMIT = 300;

Meteor.startup(function () {
  console.log('Starting server.');
  startPublish();
});

function startPublish() {
  Meteor.publish('currentPage', function(pageName) {
    return WikiPages.find({name: pageName});
  });
  Meteor.publish('recentEdits', function(pageId, limit) {
    return WikiEdits.find({pageId: pageId}, {sort: {ts: -1},
      limit: limit || RECENT_EDIT_LIMIT});
  });
  Meteor.publish('recentMessages', function(pageId) {
    return WikiMessages.find({pageId: pageId}, {sort: {created: -1},
      limit: RECENT_MESSAGE_LIMIT});
  });
  Meteor.publish('profileView', function(userId) {
    return Meteor.users.find(userId);
  });
  Meteor.publish('messagesForUser', function(userId) {
    return WikiMessages.find({userId: userId}, {sort: {created: -1}});
  });
  Meteor.publish('editsForUser', function(userId) {
    return WikiEdits.find({createdBy: userId}, {sort: {ts: -1}});
  });

  Meteor.publish('arty', function() {
    return WikiPages.find({}, {limit: 100});
  });

}
