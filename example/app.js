
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , socketio = require('socket.io')
  , routes = require('./routes')
  , folio = require('folio')
  , path = require('path')
  , seed = require('seed');

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

// Our psuedo database

var Minimal = {};

Minimal.Comment = Seed.Model.extend('comment', {
  schema: new Seed.Schema({
    name: String,
    body: String
  })
});

Minimal.Todo = Seed.Model.extend('todo', {
  schema: new Seed.Schema({
    title: String,
    completed: Boolean,
    comments: [Minimal.Comment]
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

io.sockets.on('connection', function (socket) {
  
  var create = function (data, callback) {
    var id = guid.gen()
      , todo = db.set('/todo/' + id, data)
      , json = todo._attributes;
    
    socket.emit('todos:create', json);
    socket.broadcast.emit('todos:create', json);
    callback(null, json);
  };
  
  socket.on('todo:create', create);
  socket.on('todos:create', create);
  
  socket.on('todos:read', function (data, callback) {
    var list = [];
    
    db.each('todo', function (todo) {
      list.push(todo._attributes);
    });
    
    callback(null, list);
  });
  
  socket.on('todos:update', function (data, callback) {
    var todo = db.get('/todo/' + data.id);
    todo.set(data);
    
    var json = todo._attributes;
    
    socket.emit('todos/' + data.id + ':update', json);
    socket.broadcast.emit('todos/' + data.id + ':update', json);
    callback(null, json);
  });
  
  socket.on('todos:delete', function (data, callback) {
    var json = db.get('/todo/' + data.id)._attributes;
    
    db.del('/todo/' + data.id);
    
    socket.emit('todos/' + data.id + ':delete', json);
    socket.broadcast.emit('todos/' + data.id + ':delete', json);
    callback(null, json);
  });
  
});

// Routes

app.get('/', routes.index);
app.get('/js/templates.js', routes.templatejs);
app.get('/js/vendor.js', routes.vendorjs);

app.listen(1227);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
