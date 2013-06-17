var crypto;

crypto = Npm.require('crypto');

/**
 * @fileOverView A declaration of methods available.
 */
Meteor.methods({
  edit: submitEdit,
  talk: submitTalk
});

/**
 * @param {string} pageId
 * @param {string} pageName
 * @param {string} content
 * @param {string} comment
 * @return {boolean}
 */
function submitEdit(pageId, pageName, content, comment) {
  var hash, md5sum, edit, page, ts, formattedContent;
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
  edit._id = WikiEdits.insert(edit);
  page.lastEditId = edit._id;
  page.lastUpdated = ts;
  WikiPages.update(page._id, page);
  return {success: true};
}

/**
 * @param {string} pageId
 * @param {string} message
 * @param {string=} editId
 */
function submitTalk(pageId, message, editId) {
  var page, msg, ts;
  if (!this.userId) {
    return {success: false, error: 'Must be logged in to discuss.'};
  }
  if (!_.isString(pageId) || _.isEmpty(pageId)) {
    return {success: false, error: 'This page has not been created yet.'};
  }
  if (!WikiPages.findOne({_id: pageId})) {
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
    updated: ts,
    created: ts
  }
  WikiMessages.insert(msg);
  return {success: true};
}

/**
 * @param {string}
 * @return {string}
 */
function formatContent(content) {
  return marked(content);
}
