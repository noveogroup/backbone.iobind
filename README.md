# Backbone.ioBind v0.1.0

Backbone.ioBind allows you to bind socket.io events to backbone model & collection events. 

View the full api [documentation](http://logicalparadox.github.com/backbone.iobind/).

### Dependancies

* [Socket.io](http://socket.io/) 0.7.x || 0.8.x
* [Backbone](http://documentcloud.github.com/backbone/) 0.5.x

## Scenario

Here is a quick model/collection recipe as a starting point. Do NOT bind to reserved backbone 
events, such as `change`, `remove`, and `add`. Proxy these events using different event tags 
such as `update`, `delete`, and `create`.

The following is just a guideline. If you end up using it different please let me know :D

``` js
// Start off by creating your client-side socket.io connection.
var socket = io.connect('http://localhost');
```

### Model

``` js
// Set up your client model
var Todo = Backbone.Model.extend({
	urlRoot: 'todos',
	initialize: function () {
		_.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
		this.ioBind('update', socket, this.serverChange, this);
		this.ioBind('delete', socket, this.serverDelete, this);
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
		this.ioUnbindAll(socket);
		return this;
	}
});

// Then emit some events on the server side.
socket.emit('todos/' + todo_obj.id + ':update', todo_obj);
socket.emit('todos/' + todo_obj.id + ':delete', todo_obj);
```

### Collection

In this example the client is binding to server `create` events. Therefor, create a model instance, populate, save, then discard 
reference. Let the server event handle adding the new model to the collection to ensure id consistency.

``` js
// Again, client side.
var Todos = Backbone.Collection.extend({
	model: Todo,
	url: 'todos',
	initialize: function () {
		_.bindAll(this, 'serverCreate', 'collectionCleanup');
		this.ioBind('create', socket, this.serverCreate, this);
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
		this.ioUnbindAll(socket);
		this.each(function (model) {
			model.modelCleanup();
		});
		return this;
	}
});

// And on the server. Note that collection events to include the model id in the event path.
socket.emit('todos:create', todo_obj);
```

## Protip

Works great with the awesome [backbone.modelbinding](https://github.com/derickbailey/backbone.modelbinding).

## License

(The MIT License)

Copyright (c) 2011 Jake Luer

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