# Backbone.ioBind

Backbone.ioBind allows you to bind socket.io events to backbone model & collection events.
Also includes `backbone.iosync.js`, a drop in replacement for `Backbone.sync` that uses socket.io. 

### [NEW] Example Tasks Application

To help break the ice, I have put together an example application demonstrating the basics of using
`ioSync` and `ioBind`. It is a tasks application that will keep itself syncronized across all open
browser instances. The foundation is your cookie-cutter [Express](https://github.com/visionmedia/express) 
server using [Seed](https://github.com/logicalparadox/seed) as an in memory data store.

The app is found in the `example` folder. 
View the [Wiki Article](https://github.com/logicalparadox/backbone.iobind/wiki/Example-App)
on the example app for instructions on how to get everything set up.

### Quick Links

* [Changelog](https://github.com/logicalparadox/backbone.iobind/blob/master/History.md)
* [API Documentation](http://logicalparadox.github.com/backbone.iobind/)
* [Example App Installation](https://github.com/logicalparadox/backbone.iobind/wiki/Example-App)
* [Google Group](https://groups.google.com/group/backboneiobind)

### Dependancies

* [Socket.io](http://socket.io/) 0.7.x || 0.8.x
* [Backbone](http://documentcloud.github.com/backbone/) 0.5.x

## Usage

Download and include in your projects.

```html
<script src="/js/backbone.iosync.js" />
<script src="/js/backbone.iobind.js" />
```

Or use the minimized versions.

```html
<script src="/js/backbone.iosync.min.js" />
<script src="/js/backbone.iobind.min.js" />
```

## Where to Get Help

Please post issues to [GitHub Issues](https://github.com/logicalparadox/backbone.iobind/issues). 
Community forum is available at the [Google Group](https://groups.google.com/group/backboneiobind).

## Using the Backbone.sync Replacement

The Backbone.sync replacement, `backbone.iosync.js`, is a drop-in replacement for Backbone.sync that
will make Backbone use socket.io for all normal CRUD operations. By this, anytime you `save` a model,
`fetch` a collection, `remove` a model, or other database operation, socket.io will be used as the
transport.

After we cover the specifics there will be a skeleton socket.io template you can use in your projects.

Here is what you need to know to use this replacement...

### Namespaces / Urls

Backbone has a dedicated attribute, `urlRoot` for models, and `url` for collections, that is used
by the default sync method to direct AJAX request. ioSync uses this same attribute to create a
namespace tag for that model. As with the default sync method, ioSync will default to the `url` of the 
collection a model is a part of, if available. If not available, then it will use the models `urlRoot`.

*For Example:* If your collection url is 'posts' or '/posts', the events to listen for server-side will be:

* `posts:create`
* `posts:read`
* `posts:update`
* `posts:delete`

*Note: if your url has a depth of more than one, only the first will be used. Example: `/posts/comments` will still only have a namespace of `posts`.*

### RPC / Callbacks

This replacement assumes that you are using socket.io's RPC (callback) formula for these events.
Take, for example, this psuedo-code:

```js
socket.on('posts:read', function (data, callback) {
  db.query({_id: data.id}, function (err, model) {
    if (err) {
      callback(err);
    } else {
      // ... some data scrubbing
      callback(null, model);
    }
  });
});
```

The callback accepts two parameters: `error` and `model`. If no error has occurred, send `null` for `error`. 

The `model` should be a JSON representation of the client-side model's attributes.

### Skeleton

You can always use this as a starting point.

```js
io.sockets.on('connection', function (socket) {
  
  socket.on('todos:create', function (data, callback) {

    // callback(null, json);
  });
  
  socket.on('todos:read', function (data, callback) {

    // callback(null, json);
  });
  
  socket.on('todos:update', function (data, callback) {

    // callback(null, json);
  });
  
  socket.on('todos:delete', function (data, callback) {

    // callback(null, json);
  });
  
});
```

## Using Backbone.ioBind for Custom Events

The primary function for Backbone.ioBind is to make it easy to create client-side listners
for server-side socket.io events. The most likely use case for this is to broadcast changes
made by one client to all other clients watching a particular data object.

Here is a quick model/collection recipe as a starting point. Do NOT bind to reserved backbone 
events, such as `change`, `remove`, and `add`. Proxy these events using different event tags 
such as `update`, `delete`, and `create`.

The following code is taken directly from the example Todo Application. If you would prefer to
dive in to the example app, check out the 
[wiki page on using the example app](https://github.com/logicalparadox/backbone.iobind/wiki/Example-App).

The following is just a guideline. If you end up using it different please let me know.

```js
// Start off by creating your client-side socket.io connection.
window.socket = io.connect('http://localhost');
```

If you are using unmodified `backbone.iosync.js`, then your connection should exists on
`window.socket` or `Backbone.socket`.

### Model

```js
// Set up your client model
var Todo = Backbone.Model.extend({
	urlRoot: 'todo',
	initialize: function () {
		_.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
		this.ioBind('update', window.socket, this.serverChange, this);
		this.ioBind('delete', window.socket, this.serverDelete, this);
	},
	serverChange: function (data) {
		// Useful to prevent loops when dealing with client-side updates (ie: forms).
		data.fromServer = true;
		this.set(data);
	},
	serverDelete: function (data) {
		if (this.collection) {
			this.collection.remove(this);
		}
		else {
			this.trigger('remove', this);
		}
	},
	modelCleanup: function () {
		this.ioUnbindAll(window.socket);
		return this;
	}
});

// Then emit some events on the server side.
socket.emit('todo/' + todo_obj.id + ':update', todo_obj);
socket.emit('todo/' + todo_obj.id + ':delete', todo_obj);

// If model is part of collection must also emit collection event.
socket.emit('todos/' + todo_obj.id + ':update', todo_obj);
socket.emit('todos/' + todo_obj.id + ':delete', todo_obj);
```

### Collection

In this example the client is binding to server `create` events. Therefor, create a model instance, populate, save, then discard 
reference. Let the server event handle adding the new model to the collection to ensure id consistency.

```js
// Again, client side.
var Todos = Backbone.Collection.extend({
	model: Todo,
	url: 'todos',
	initialize: function () {
		_.bindAll(this, 'serverCreate', 'collectionCleanup');
		this.ioBind('create', window.socket, this.serverCreate, this);
	},
	serverCreate: function (data) {
		// make sure no duplicates, just in case
		var exists = this.get(data.id);
		if (!exists) {
			this.add(data);
		} else {
			data.fromServer = true;
			exists.set(data);
		}
	},
	collectionCleanup: function(callback) {
		this.ioUnbindAll(window.socket);
		this.each(function (model) {
			model.modelCleanup();
		});
		return this;
	}
});

// And on the server. Note that collection events do not include the model id in the event path.
socket.emit('todos:create', todo_obj);
```

## Building

Build tool is built in [jake](https://github.com/mde/jake).

`npm install jake -g`

Clone this repo:

`git clone https://github.com/logicalparadox/backbone.iobind`

Install development/build dependancies (Ie: [folio](https://github.com/logicalparadox/folio)).:

`npm install`

Run jake

`jake` for detailed information, `jake build:all` to build all files.

## Protip

Works great with the awesome [backbone.modelbinding](https://github.com/derickbailey/backbone.modelbinding).

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) if you are interested in being regular contributor.

* Jake Luer ([Github: @logicalparadox](http://github.com/logicalparadox)) ([Twitter: @jakeluer](http://twitter.com/jakeluer)) ([Website](http://alogicalparadox.com))

## License

(The MIT License)

Copyright (c) 2011 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.