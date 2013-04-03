
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , routes = require('./routes')
  , path = require('path')
  , Seed = require('seed');

var app = module.exports = express.createServer();

// Configuration

var stylus_compile = function (str, path) {
  return stylus(str)
          .set('filename', path)
          .set('compress', true)
          .include(require('nib').path)
          .include(require('fez').path);
};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({
    src: path.join(__dirname, 'styles'),
    dest: path.join(__dirname, 'public'),
    compile: stylus_compile,
    force: true // this forces the css to be regenerated on every pageview
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Our psuedo database, on Seed.
// https://github.com/logicalparadox/seed

var Minimal = {};

Minimal.Todo = Seed.Model.extend('todo', {
  schema: new Seed.Schema({
    title: String,
    completed: Boolean
  })
});

Minimal.Todos = Seed.Graph.extend({
  initialize: function () {
    this.define(Minimal.Todo);
  }
});

var db = new Minimal.Todos()
  , guid = new Seed.ObjectId();

// Socket.io

var io = require('socket.io').listen(app);

/**
 * our socket transport events
 *
 * You will notice that when we emit the changes
 * in `create`, `update`, and `delete` we both
 * socket.emit and socket.broadcast.emit
 *
 * socket.emit sends the changes to the browser session
 * that made the request. not required in some scenarios
 * where you are only using ioSync for Socket.io
 *
 * socket.broadcast.emit sends the changes to
 * all other browser sessions. this keeps all
 * of the pages in mirror. our client-side model
 * and collection ioBinds will pick up these events
 */

io.sockets.on('connection', function (socket) {

  /**
   * todo:create
   *
   * called when we .save() our new todo
   *
   * we listen on model namespace, but emit
   * on the collection namespace
   */

  socket.on('todo:create', function (data, callback) {
    var id = guid.gen()
      , todo = db.set('/todo/' + id, data)
      , json = todo._attributes;

    socket.emit('todos:create', json);
    socket.broadcast.emit('todos:create', json);
    callback(null, json);
  });

  /**
   * todos:read
   *
   * called when we .fetch() our collection
   * in the client-side router
   */

  socket.on('todos:read', function (data, callback) {
    var list = [];

    db.each('todo', function (todo) {
      list.push(todo._attributes);
    });

    callback(null, list);
  });

  /**
   * todo:update
   *
   * called when we .save() our model
   * after toggling its completed status
   */

  socket.on('todo:update', function (data, callback) {
    var todo = db.get('/todo/' + data.id);
    todo.set(data);

    var json = todo._attributes;

    socket.emit('todo/' + data.id + ':update', json);
    socket.broadcast.emit('todo/' + data.id + ':update', json);
    callback(null, json);
  });

  /**
   * todo:delete
   *
   * called when we .destroy() our model
   */

  socket.on('todo:delete', function (data, callback) {
    console.log(db.get('/todo/' + data.id))
    var json = db.get('/todo/' + data.id)._attributes;

    db.del('/todo/' + data.id);

    socket.emit('todo/' + data.id + ':delete', json);
    socket.broadcast.emit('todo/' + data.id + ':delete', json);
    callback(null, json);
  });

});

// Routes

app.get('/', routes.index);
app.get('/js/templates.js', routes.templatejs);
app.get('/js/vendor.js', routes.vendorjs);

if (!module.parent) {
  app.listen(1228);
  console.log("Backbone.ioBind Example App listening on port %d in %s mode", app.address().port, app.settings.env);
}