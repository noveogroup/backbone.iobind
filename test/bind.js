var assert = require("assert"),
_ = require("underscore"),
Backbone = require("../dist/backbone.iobind");

describe('Backbone.iobind', function() {
  var Library = Backbone.Collection.extend({
    url: '/library',
    serverCreate: function(data) { this.add(data) },
    serverUpdate: function(data) { this.set(data) },
    serverDelete: function(data) { this.remove(data) }
  });
  var library;
  var sio;
  var attrs = {
    title  : "The Tempest",
    author : "Bill Shakespeare",
    length : 123
  };

  beforeEach(function() {
    library = new Library;
    Backbone.socket = {
      path: '',
      data: null,
      emit: function(path, data) {
        Backbone.socket.path = path;
        Backbone.socket.data = data;
      },
      //copy from socket.io-client events.js
      on: function(name, fn) {
        var _this = Backbone.socket;
        if (!_this.$events) {
          _this.$events = {};
        }

        if (!_this.$events[name]) {
          _this.$events[name] = fn;
        } else if (_.isArray(_this.$events[name])) {
          _this.$events[name].push(fn);
        } else {
          _this.$events[name] = [_this.$events[name], fn];
        }

        return _this;
      },
      //copy from socket.io-client events.js
      removeAllListeners: function (name) {
        var _this = Backbone.socket;
        if (name === undefined) {
          _this.$events = {};
          return _this;
        }

        if (_this.$events && _this.$events[name]) {
          _this.$events[name] = null;
        }

        return _this;
      }
    };
    sio = Backbone.socket;
  })

  it("ioBind", function() {
    library.create(attrs, {wait: false});
    library.ioBind('create', Backbone.socket, library.serverCreate, library);
    assert(Backbone.socket.$events.hasOwnProperty(library.url+':create'));
  })

  it("ioUnbind", function() {
    library.ioUnbind('create', sio, library.serverCreate);
    console.log(Backbone.socket.$events);
    assert(!Backbone.socket.$events);
  })

  it("ioUnbindAll", function() {
    library.ioBind('create', Backbone.socket, library.serverCreate, library);
    library.ioBind('update', Backbone.socket, library.serverUpdate, library);
    library.ioBind('delete', Backbone.socket, library.serverDelete, library);
    library.ioUnbindAll(Backbone.socket);
    assert(!Backbone.socket.$events);
  });


});

