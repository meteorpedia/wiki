var RECENT_EDIT_LIMIT

/**
 * @type {number}
 * @const
 */
RECENT_EDIT_LIMIT = 10;

Meteor.startup(function () {
  console.log('Starting server.');
  startPublish();
});

function startPublish() {
  Meteor.publish('currentPage', function(pageName) {
    return WikiPages.findOne({name: pageName});
  });
  Meteor.publish('recentEdits', function(pageId) {
    return WikiEdits.find({pageId: pageId}, {sort: {ts: -1},
      limit: RECENT_EDIT_LIMIT})
  });
}

