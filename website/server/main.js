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
    var p;
    console.log('currentPage', pageName);
    p = WikiPages.find({name: pageName});
    return p;
  });
  Meteor.publish('recentEdits', function(pageId) {
    var edits;
    edits = WikiEdits.find({pageId: pageId}, {sort: {ts: -1},
      limit: RECENT_EDIT_LIMIT});
    return edits;
  });
}

