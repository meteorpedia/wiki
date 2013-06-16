var crypto;

crypto = Npm.require('crypto');

/**
 * @fileOverView A declaration of methods available.
 */
Meteor.methods({
  edit: submitEdit
});

/**
 * @return {boolean}
 */
function submitEdit(pageId, pageName, content) {
  var hash, md5sum, edit, page, ts;
  if(_.isNull(this.userId)) {
    return {success: false, error: 'Not logged in.'};
  }
  if (_.isEmpty(content)) {
    return {success: false, error: 'Empty content submitted.'};
  }
  if (pageId) {
    page = WikiPages.findOne(pageId);
    if (!page) {
      // Has pageId, but doesn't exist. Fail, because wtf.
      return {success: false, error: 'Attempted to edit a non-existing page.'};
    }
  }
  ts = new Date().getTime();
  content = content.trim();
  pageName = pageName.trim();
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
  edit = {
    createdBy: this.userId,
    publishedBy: this.userId,
    hash: hash,
    content: content,
    ts: ts
  }
  if (!pageId) {
    if (WikiPages.findOne({name: pageName})) {
      // If no pageId but page name exists, fail, because wtf.
      return {success: false, error: 'Page already exists. Edit that one.'};
    }
    page = WikiPages.insert({
      name: pageName,
      createdBy: this.userId,
      createdOn: ts
    });
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
