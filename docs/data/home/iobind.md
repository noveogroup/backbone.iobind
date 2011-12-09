---
  title: Binding Custom Events
  weight: 20
  render-file: false
---

The primary function for Backbone.ioBind is to make it easy to create client-side listeners
for server-side socket.io events. The most likely use case for this is to broadcast changes
made by one client to all other clients watching a particular data object.

The following samples are from the example app that demonstrates a very basic usage scenario.

### ioBind

The ioBind function is available for both Models and Collections, and behaves identically in both scenarios.

    // Example Model.extend
    urlRoot: 'todo',
    socket: window.socket,
    initialize: function () {
      _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
      this.ioBind('update', this.serverChange, this);
      this.ioBind('delete', this.serverDelete, this);
    }

    // Example Collection.extend
    url: 'todos',
    socket: window.socket,
    initialize: function () {
      _.bindAll(this, 'serverCreate', 'collectionCleanup');
      this.ioBind('create', this.serverCreate, this);
    }

The primary difference between `ioBind` on Models and Collection is the event string that is listened for.
On models, the event string includes the Model `id`, whereas on collection it is simply the collection namespace.

The above example will respond to the following socket.io events.

    // Model events
    socket.emit('todo/' + todo_obj.id + ':update', todo_obj);
    socket.emit('todo/' + todo_obj.id + ':delete', todo_obj);

    // Collection events
    socket.emit('todos:create', todo_obj);