var crypto, MESSAGE_LIMIT;

crypto = Npm.require('crypto');

/**
 * @type {number}
 * @const
 */
MESSAGE_LIMIT = 300;

/**
 * @fileOverView A declaration of methods available.
 */
Meteor.methods({
  edit: submitEdit,
  delete: submitDelete,
  talk: submitTalk,
  profile: submitProfile,
  talkProfiles: talkProfiles,
  historyProfiles: historyProfiles
});

/**
 * @param {string} pageId
 * @param {string} comment
 * @return {Object}
 */
function submitDelete(pageId, comment) {
  var hash, md5sum, edit, page, ts, content;
  if(_.isNull(this.userId)) {
    return {success: false, error: 'Not logged in.'};
  }
  content = '';
  if (!_.isString(comment) || _.isEmpty(comment)) {
    comment = 'No comment.';
  }
  if (!pageId) {
    return {success: false, error: 'No page id given.'};
  }
  page = WikiPages.findOne(pageId);
  if (!page) {
    return {success: false, error: 'Attempted to delete a non-existing page.'};
  }
  ts = new Date().getTime();
  md5sum = crypto.createHash('md5');
  md5sum.update(content);
  hash = md5sum.digest('hex');
  edit = {
    createdBy: this.userId,
    publishedBy: this.userId,
    hash: hash,
    comment: comment,
    content: content,
    deleted: true,
    formattedContent: content,
    ts: ts
  }
  page.lastUpdated = ts;
  WikiPages.update(page._id, page);
  edit.pageId = page._id;
  edit.pageName = page.name;
  edit._id = WikiEdits.insert(edit);
  page.lastEditId = edit._id;
  page.lastUpdated = ts;
  WikiPages.update(page._id, page);
  return {success: true};
}

/**
 * @param {string} pageId
 * @param {string} pageName
 * @param {string} content
 * @param {string} comment
 * @return {Object}
 */
function submitEdit(pageId, pageName, content, comment) {
  var hash, md5sum, edit, page, ts, formattedContent, hookData;
  if(_.isNull(this.userId)) {
    return {success: false, error: 'Not logged in.'};
  }
  content = content.trim();
  pageName = pageName.trim();
  comment = comment.trim();
  if (!_.isString(content) || _.isEmpty(content)) {
    return {success: false, error: 'Empty content submitted.'};
  }
  if (!_.isString(pageName) || _.isEmpty(pageName)) {
    return {success: false, error: 'No page name given.'};
  }
  if (!_.isString(comment) || _.isEmpty(comment)) {
    comment = 'No comment.';
  }
  if (pageId) {
    page = WikiPages.findOne(pageId);
    if (!page) {
      // Has pageId, but doesn't exist. Fail, because wtf.
      return {success: false, error: 'Attempted to edit a non-existing page.'};
    }
  }
  ts = new Date().getTime();
  md5sum = crypto.createHash('md5');
  md5sum.update(content);
  hash = md5sum.digest('hex');
  if (edit = WikiEdits.findOne({hash: hash})) {
    if (!pageId || edit.pageId !== pageId) {
      return {success: false, error: 'Another page already has this content.'};
    }
    page = WikiPages.findOne(pageId);
    edit.publishedBy = this.userId;
    if (!edit.created) {
      // Migration, this property did not used to exist.
      edit.created = edit.ts;
    }
    edit.ts = ts;
    WikiEdits.update(edit._id, edit);
    page.lastUpdated = ts;
    page.lastEditId = edit._id;
    WikiPages.update(page._id, page);
    return {success: true};
  }
  formattedContent = formatContent(content);
  edit = {
    createdBy: this.userId,
    publishedBy: this.userId,
    hash: hash,
    comment: comment,
    content: content,
    formattedContent: formattedContent,
    created: ts,
    ts: ts
  }
  if (!pageId) {
    if (WikiPages.findOne({name: pageName})) {
      // If no pageId but page name exists, fail, because wtf.
      return {success: false, error: 'Page already exists. Edit that one.'};
    }
    page = {
      name: pageName,
      createdBy: this.userId,
      createdOn: ts
    };
    page._id = WikiPages.insert(page);
  } else {
    page.lastUpdated = ts;
    WikiPages.update(page._id, page);
  }
  edit.pageId = page._id;
  edit.pageName = page.name;

  hookData = Extensions.runHookChain('submitEdit', { edit: edit, page: page });
  edit = hookData.edit; page = hookData.page;

  edit._id = WikiEdits.insert(edit);
  page.lastEditId = edit._id;
  page.lastUpdated = ts;
  WikiPages.update(page._id, page);
  return {success: true};
}
Extensions.registerHookType('submitEdit', '0.1.0');

/**
 * @param {string} pageId
 * @param {string} message
 * @param {string=} editId
 * @return {Object}
 */
function submitTalk(pageId, message, editId) {
  var page, msg, ts;
  if (!this.userId) {
    return {success: false, error: 'Must be logged in to discuss.'};
  }
  if (!_.isString(pageId) || _.isEmpty(pageId)) {
    return {success: false, error: 'This page has not been created yet.'};
  }
  if (!(page = WikiPages.findOne({_id: pageId}))) {
    return {success: false, error: 'Tried to add a comment to an invalid page.'};
  }
  message = message.trim();
  if (!_.isString(message) || _.isEmpty(message)) {
    return {success: false, error: 'Message cannot be blank.'};
  }
  ts = new Date().getTime();
  if (editId) {
    msg = WikiMessages.findOne({_id: editId, pageId: pageId,
      userId: this.userId});
    if (!msg) {
      return {success: false,
        error: 'Attempted to edit a non-existing message.'};
    }
    msg.content = message;
    msg.formattedContent = formatContent(message);
    msg.updated = ts;
    WikiMessages.update(msg._id, msg);
    return {success: true};
  }
  msg = {
    content: message,
    formattedContent: formatContent(message),
    userId: this.userId,
    pageId: pageId,
    pageName: page.name,
    updated: ts,
    created: ts
  }
  WikiMessages.insert(msg);
  return {success: true};
}

/**
 * @param {string} profileName
 * @param {string} email
 * @return {Object}
 */
function submitProfile(profileName, email) {
  var user, profile;
  if (!this.userId) {
    return {success: false, error: 'Must be logged in to edit profile.'};
  }
  profileName = profileName.trim();
  email = email.trim();
  if (_.isEmpty(profileName) || _.isEmpty(email)) {
    return {success: false, error: 'Email and name cannot be blank.'};
  }
  user = Meteor.users.findOne({_id: this.userId});
  user.emails[0].address = email;
  profile = user.profile || {};
  profile.name = profileName;
  user.profile = profile;
  Meteor.users.update(this.userId, user);
  return {success: true};
}

/**
 * @param {string} content
 * @return {string}
 */
function formatContent(content) {
  return Extensions.runHookChain('formatContentPostMD',
    marked(Extensions.runHookChain('formatContentPreMD', content)));
}
Extensions.registerHookType('formatContentPreMD', '0.1.0');
Extensions.registerHookType('formatContentPostMD', '0.1.0');

/*
 * @param {string} pageId
 * @return {Object}
 */
function talkProfiles(pageId) {
  return profiles(pageId, WikiMessages, MESSAGE_LIMIT, 'created', ['userId']);
}

/**
 * @param {string} pageId
 * @return {Object}
 */
function historyProfiles(pageId) {
  return profiles(pageId, WikiEdits, MESSAGE_LIMIT, 'ts',
    ['createdBy', 'publishedBy']);
}


/**
 * @param {string} pageId
 * @param {Meteor.Collection} collection
 * @param {number} limit
 * @param {string} sortField
 * @param {string} userFields
 * @return {Object}
 */
function profiles(pageId, collection, limit, sortField, userFields) {
  var userMap, sortInstructions;
  sortInstructions = {};
  sortInstructions[sortField] = -1;
  userMap = {};
  collection.find({pageId: pageId},
    {limit: limit, sort: sortInstructions}).forEach(
    function(doc) {
      var userId;
      var user, profile;
      _.every(userFields, function(field) {
        if (_.has(userMap, doc[field])) {
          return;
        }
        userId = doc[field];
        user = Meteor.users.findOne({_id: userId});
        if (!user || !user.profile) {
          profile = {};
        } else {
          profile = user.profile;
        }
        userMap[userId] = {
          name: profile.name || 'Anonymous'
        };
      });
    });
  return {userMap: userMap, pageId: pageId};
}
