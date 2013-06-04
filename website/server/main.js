Meteor.startup(function () {
  console.log('Starting server.');
  startPublish();
});

function startPublish() {
  Meteor.publish('userOrg', function(userId) {
    return Orgs.findOne({userId: userId});
  });
  Meteor.publish('userProfile', function(userId) {
    return Profiles.findOne({userId: userId});
  });
}

