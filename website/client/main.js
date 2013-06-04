Deps.autorun(function () {
    Meteor.subscribe('userOrg', Meteor.userId());
    Meteor.subscribe('userProfile', Meteor.userId());
});

/**
 * @return {boolean}
 */
Template.body.isLoggedIn = function() {
  return !!Meteor.userId();
};

/**
 * @return {boolean}
 */
Template.entry.isSetup = function() {
  var org, profile;
  org = Orgs.findOne({userId: Meteor.userId()});
  if (org) {
    return true;
  }
  return !!Profiles.findOne({userId: Meteor.userId});
};

