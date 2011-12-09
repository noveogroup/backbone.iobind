---
  title: Backbone.sync Replacement
  menu: Sync Replacement
  weight: 10
  render-file: false
---

The Backbone.sync replacement for [socket.io](http://socket.io), `backbone.iosync.js`, is a drop-in replacement for Backbone.sync that
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

The callback accepts two parameters: `error` and `model`. If no error has occurred, send `null` for `error`.

The `model` should be a JSON representation of the client-side model's attributes.