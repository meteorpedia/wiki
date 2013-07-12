# Extending Meteorpedia is easy!

## Add extensions via meteorite

```bash
mrt add meteorpedia-extensionName
```

## Writing an extension or plugin

### Extensions vs plugins

Extensions are lower level functions that "hook" into Meteorpedia's internals.  These hooks allow you to e.g. manipulate raw data before it is saved to the database or displayed to the user.

Plugins are higher level functions that "plug" in to other extensions.  They require a lot less knowledge to write and rely on the extension they plug into to handle the more complicated stuff.

e.g.  The parser extension affects how {{clauses}} are rendered, and can accomodate nested
blocks, tranclusion, variable substition, etc.  Plugins can "plug" into the parser extension, e.g. {{#if: if | then | else}.  This "if" plugin will receive 3 arguments and the {{#if}} block will be replaced by the function's return value.  The plugin doesn't need to worry about complicated regular expressions, escaped placeholders, etc.

### Example code

Both extensions and plugins are added using the Extensions.add method.  Extensions will usually utilitize only 'hooks', and plugins only 'plugins', but it is possible to use
both.

````js

Extensions.add({
    name: "example",
	version: "0.1.0",
	author: "Your name <email@address.com>",
	description: "Makes content cool!",
	hooks: {
		'formatContentPostMD': function(content) {
			return 'cool' + content;
		}
	}
})
````

Meteorpedia uses the [meteor-extensions](https://github.com/gadicohen/meteor-extensions) smart package, and the README.md of that project gives more detailed explanations.  See also the [meteorpedia-mediawiki](https://github.com/gadicohen/meteorpedia-mediawiki) extension for a working example.  Note that the extension provides hooks of it's own which make it a lot easier to write other more simple extensions.

### Available hooks

#### client/read.js

render - change the page object before rendering on client
* (1.0) func({ edit: edit, page: page }) must return { edit: edit, page: page }
* (0.1) func(edit), must return edit

#### server/methods.js

submitEdit - change to use/change edit/page data just before database update
* (0.1) func({ edit: edit, page: page }) must return { edit: edit, page: page }

submitEditAfter - run after the edit has been saved to the database
* (0.1) func({ edut: edit, page, page })

formatContentPreMD - format content before markdown
* (0.1) func(content), must return (modified) content

formatContentPostMD - format content post markdown
* (0.1) func(content), must return (modified) content

#### client/main.js

activeViews - needed to add new View keywords, e.g. /special/Categories
* (0.1) func(activeViews), must return activeViews
