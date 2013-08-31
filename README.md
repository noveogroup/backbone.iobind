# Backbone.ioBind

Backbone.ioBind allows you to bind socket.io events to backbone model & collection events.
Also includes `backbone.iosync.js`, a drop in replacement for `Backbone.sync` that uses socket.io.

Your best best for starting is to check out the [API Documentation](http://alogicalparadox.com/backbone.iobind/).

#### Quick Links

* [Example App Installation](http://alogicalparadox.com/backbone.iobind/index.html#exampleapp)
* [Google Group](https://groups.google.com/group/backboneiobind)
* [Changelog](https://github.com/logicalparadox/backbone.iobind/blob/master/History.md)

#### Dependancies

* [Socket.io](http://socket.io/) 0.7.x || 0.8.x || 0.9.x
* [Backbone](http://documentcloud.github.com/backbone/) 1.0.0

#### Compatibility

Use Backbone.ioBind < 0.4.6 for compatibility with version Backbone less then 1.0.0

### Usage

Download and include in your projects.

```html
<script src="/js/backbone.iosync.js"></script>
<script src="/js/backbone.iobind.js"></script>
```

Or use the minimized versions.

```html
<script src="/js/backbone.iosync.min.js"></script>
<script src="/js/backbone.iobind.min.js"></script>
```

### Where to Get Help

Please post issues to [GitHub Issues](https://github.com/logicalparadox/backbone.iobind/issues).
Community forum is available at the [Google Group](https://groups.google.com/group/backboneiobind).

## Using the Backbone.sync Replacement for Socket.io

The Backbone.sync replacement, `backbone.iosync.js`, is a drop-in replacement for Backbone.sync that
will make Backbone use socket.io for all normal CRUD operations. By this, anytime you `save` a model,
`fetch` a collection, `remove` a model, or other database operation, socket.io will be used as the
transport.

### Namespaces / Urls

Backbone has a dedicated attribute, `urlRoot` for models, and `url` for collections, that is used
by the default sync method to direct AJAX request. ioSync uses this same attribute to create a
namespace tag for that model.

*For Example:* If your collection url is 'posts' or '/posts', the events to listen for server-side will be:

* `posts:create`
* `posts:read`
* `posts:update`
* `posts:delete`

As with the default sync method, for a given model, ioSync will default to the `url` of the collection
that model is a part of, else it will use the models `urlRoot`.

If your url has a depth of more than one, only the first will be used. Example: `/posts/comments` will still only have a namespace of `posts`.*

### RPC / Callbacks

This replacement assumes that you are using socket.io's RPC (callback) formula for these events.
Examine this psuedo-code:

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

## Using Backbone.ioBind for Custom Events

The primary function for Backbone.ioBind is to make it easy to create client-side listeners
for server-side socket.io events. The most likely use case for this is to broadcast changes
made by one client to all other clients watching a particular data object.

The example app demonstrates a very basic usage scenario. If you would like to see specific code
examples, please check out the
[wiki page on using the example app](http://alogicalparadox.com/backbone.iobind/index.html#exampleapp).

### ioBind

The ioBind function is available for both Models and Collections, and behaves almost identically in both scenarios

```js
// Example Model.extend
urlRoot: 'todo',
initialize: function () {
  _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
  this.ioBind('update', window.socket, this.serverChange, this);
  this.ioBind('delete', window.socket, this.serverDelete, this);
}

// Example Collection.exend
url: 'todos',
initialize: function () {
  _.bindAll(this, 'serverCreate', 'collectionCleanup');
  this.ioBind('create', window.socket, this.serverCreate, this);
}
```

The primary difference between `ioBind` on Models and Collection is the event string that is listened for.
On models, the event string includes the Model `id`, whereas on collection it is simply the collection namespace.

The above example will respond to the following socket.io events.

```js
// Model events
socket.emit('todo/' + todo_obj.id + ':update', todo_obj);
socket.emit('todo/' + todo_obj.id + ':delete', todo_obj);

// Collection events
socket.emit('todos:create', todo_obj);
```

### Usage Guidelines

*Model binding without ID:* Do NOT bind to Models that do NOT have an `id` assigned. This will cause for extra listeners
and cause potentially large memory leak problems. See the example app for one possible workaround.

*Namespace construction:* When constructing the namespace, as with the the ioSync method, for a given model ioBind
will default to the `url` of the collection that model is a part of, else it will use the models `urlRoot`.

*Reserved events:* Do NOT bind to reserved backbone events, such as `change`, `remove`, and `add`. Proxy these
events using different event tags such as `update`, `delete`, and `create`.

## Building

Clone this repo:

`$ git clone https://github.com/logicalparadox/backbone.iobind`

Install development/build dependancies (Ie: [folio](https://github.com/logicalparadox/folio)).:

`$ npm install`

Run make

`$ make`

#### Example Tasks Application

There is an example application demonstrating the basics of using the
`ioSync` and `ioBind` components. It is a tasks application that will keep itself syncronized across all open
browser instances. The foundation is an [Express](https://github.com/visionmedia/express)
server using [Seed](https://github.com/logicalparadox/seed) as an in-memory data store.

The app is found in the `example` folder.
View the [Documentation Article](http://alogicalparadox.com/backbone.iobind/index.html#exampleapp)
on the example app for instructions on how to get everything set up.

In short, run `node example/app.js` from the root directory.

## Other Frameworks

- [Backbone.realtimeBind](https://github.com/andreisebastianc/Backbone.js-Cometd-RealtimeBind) - ioBind for CometD by [@andreisebastianc](https://github.com/andreisebastianc/).

## Protip

Works great with the awesome [backbone.modelbinding](https://github.com/derickbailey/backbone.modelbinding).

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) if you are interested in being regular contributor.

* Jake Luer [[Github: @logicalparadox](http://github.com/logicalparadox)] [[Twitter: @jakeluer](http://twitter.com/jakeluer)] [[Website](http://alogicalparadox.com)]

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
