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
    var p;
    console.log('currentPage', pageName);
    p = WikiPages.find({name: pageName});
    return p;
  });
  Meteor.publish('recentEdits', function(pageId) {
    var edits;
    return WikiEdits.find({pageId: pageId}, {sort: {ts: -1},
      limit: RECENT_EDIT_LIMIT});
    return edits;
  });
  Meteor.publish('recentMessages', function(pageId) {
    var messages;
    return WikiMessages.find({pageId: pageId}, {sort: {created: -1},
      limit: RECENT_MESSAGE_LIMIT});
  });
}

