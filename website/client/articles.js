Articles = function () {
  this.init_();
}

SESSION_PROFILE_ID = 'articlesId';

Articles.prototype = _.clone(View);
AA = Articles.prototype;

Deps.autorun(function () {
  //Meteor.subscribe('arty');
})

AA.name = 'articles';

Template.articles.events({
  'click a': handleClick
})

Template.articles.pages = function () {
  return WikiPages.find().fetch().map(map)
}

function handleClick(e) {
  var route = e.target.parentElement.className === 'page'
            ? ['read', [this.name], [{}, 'read', this.name]]
            : ['profile', [this.createdBy], [{}, 'profile', this.createdBy]]
  e.preventDefault()
  window.router.run.apply(window.router, route)
}

function map (doc) {
  var author = Meteor.users.findOne(doc.createdBy);
  return _.extend(doc, {
    lastEdit:  Date(doc.lastUpdated).slice(4, 25),
    creationDate: Date(doc.createdOn).slice(4, 25),
    author: author && author.profile && author.profile.name
  })
}
