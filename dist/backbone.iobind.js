
// Wrapper based on https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['backbone', 'underscore', 'socket.io', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    var _ = require('underscore'),
      Backbone = require('backbone'),
      io = require('socket.io-client'),
      $ = require('jquery');
    module.exports = factory(Backbone, _, io, $);
  } else {
    // Browser globals (root is window)
    factory(root.Backbone, root._, root.io, (root.jQuery || root.Zepto || root.ender || root.$));
  }
}(this, function (Backbone, _, io, $){


/*!
 * backbone.iobind - Model
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Version
 */
Backbone.Model.prototype.ioBindVersion = '0.4.7';

/**
 * # .ioBind(event, callback, [context])
 *
 * Bind and handle trigger of socket.io events for models.
 *
 * ### Guidelines
 *
 * Do NOT bind to reserved backbone events, such as `change`, `remove`, and `add`.
 * Proxy these events using different event tags such as `update`, `delete`, and `create`.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`, or
 * `this.socket` or it must be passed as the second argument.
 *
 * ### Example
 *
 * * Model definition has url: `my_model`
 * * Model instance has id: `abc123`
 *
 * #### Create a new bind (client-side):
 *
 *     model.ioBind('update', window.io, this.updateView, this);
 *
 * #### Send socket.io message (server-side)
 *
 *     socket.emit( 'my_model/abc123:update', { title: 'My New Title' } );
 *
 * @name ioBind
 * @param {String} eventName
 * @param {Object} io from active socket.io connection (optional)
 * @param {Function} callback
 * @param {Object} context (optional) object to interpret as this on callback
 * @api public
 */

Backbone.Model.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = _.result(this, 'url') + ':' + eventName
    , self = this;
  if ('function' == typeof io) {
    context = callback;
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function () {
      var args = [eventName];
      args.push.apply(args, arguments);
      self.trigger.apply(self, args);
    }
  };
  this.bind(event.name, event.cbLocal, (context || self));
  io.on(event.global, event.cbGlobal);
  if (!ioEvents[event.name]) {
    ioEvents[event.name] = [event];
  } else {
    ioEvents[event.name].push(event);
  }
  return this;
};

/**
 * # .ioUnbind(event, [callback])
 *
 * Unbind model triggers and stop listening for server events for a specific
 * event and optional callback.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`,
 * or `this.socket` or it must be passed as the second argument.
 *
 * @name ioUnbind
 * @param {String} eventName
 * @param {Object} io from active socket.io connection
 * @param {Function} callback (optional) If not provided will remove all callbacks for eventname.
 * @api public
 */

Backbone.Model.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url() + ':' + eventName;
  if ('function' == typeof io) {
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var events = ioEvents[eventName];
  if (!_.isEmpty(events)) {
    if (callback && 'function' === typeof callback) {
      for (var i = 0, l = events.length; i < l; i++) {
        if (callback == events[i].cbLocal) {
          this.unbind(events[i].name, events[i].cbLocal);
          io.removeListener(events[i].global, events[i].cbGlobal);
          events[i] = false;
        }
      }
      events = _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
      delete io.$events[globalName];
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};

/**
 * # .ioUnbindAll()
 *
 * Unbind all callbacks and server listening events for the given model.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`,
 * or `this.socket` or it must be passed as the only argument.
 *
 * @name ioUnbindAll
 * @param {Object} io from active socket.io connection
 * @api public
 */

Backbone.Model.prototype.ioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  if (!io) io = this.socket || window.socket || Backbone.socket;
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};


/*!
 * backbone.iobind - Collection
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Version
 */

Backbone.Collection.prototype.ioBindVersion = '0.4.7';

/**
 * # ioBind
 *
 * Bind and handle trigger of socket.io event for collections.
 *
 * ### Guidelines
 *
 * Do NOT bind to reserved backbone events, such as `change`, `remove`, and `add`.
 *
 * Proxy these events using different event tags such as `update`, `delete`, and `create`.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`,
 * or `this.socket` or it must be passed as the second argument.
 *
 * ### Example
 *
 * * Model definition has url: `my_model`
 * * Model instance has id: `abc123`
 *
 * #### Create a new bind (client-side):
 *
 *     model.ioBind('update', window.io, this.updateView, this);
 *
 * #### Send socket.io message (server-side)
 *
 *     socket.emit( 'my_model/abc123:update', { title: 'My New Title' } );
 *
 * @name ioBind
 * @param {String} eventName
 * @param {Object} io from active socket.io connection
 * @param {Function} callback
 * @param {Object} context (optional): Object to interpret as this on callback
 * @api public
 */

Backbone.Collection.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = _.result(this, 'url') + ':' + eventName
    , self = this;
  if ('function' == typeof io) {
    context = callback;
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function () {
      var args = [eventName];
      args.push.apply(args, arguments);
      self.trigger.apply(self, args);
    }
  };
  this.bind(event.name, event.cbLocal, context);
  io.on(event.global, event.cbGlobal);
  if (!ioEvents[event.name]) {
    ioEvents[event.name] = [event];
  } else {
    ioEvents[event.name].push(event);
  }
  return this;
};

/**
 * # ioUnbind
 *
 * Unbind model triggers and stop listening for server events for a specific event
 * and optional callback.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`,
 * or `this.socket` or it must be passed as the second argument.
 *
 * @name ioUnbind
 * @param {String} eventName
 * @param {Object} io from active socket.io connection
 * @param {Function} callback (optional) If not provided will remove all callbacks for `eventName`
 * @api public
 */

Backbone.Collection.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url + ':' + eventName;
  if ('function' == typeof io) {
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var events = ioEvents[eventName];
  if (!_.isEmpty(events)) {
    if (callback && 'function' === typeof callback) {
      for (var i = 0, l = events.length; i < l; i++) {
        if (callback == events[i].cbLocal) {
          this.unbind(events[i].name, events[i].cbLocal);
          io.removeListener(events[i].global, events[i].cbGlobal);
          events[i] = false;
        }
      }
      events = _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
      delete io.$events[globalName];
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};

/**
 * # ioUnbindAll
 *
 * Unbind all callbacks and server listening events for the given model.
 *
 * The socket.io socket must either exist at `window.socket`, `Backbone.socket`,
 * or `this.socket` or it must be passed as the only argument.
 *
 * @name ioUnbindAll
 * @param {Object} io from active socket.io connection
 * @api public
 */

Backbone.Collection.prototype.ioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  if (!io) io = this.socket || window.socket || Backbone.socket;
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};


  return Backbone;
}));
