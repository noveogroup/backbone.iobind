/*!
 * backbone.iobind
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 * https://logicalparadox.github.com/backbone.iobind
 */
 
Backbone.Model.prototype.ioBindVersion = '0.1.0';
Backbone.Collection.prototype.ioBindVersion = '0.1.0';
/*!
 * backbone.iobind - Model
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

/**
 * Bind and handle trigger of socket.io event.
 * 
 * Do not use Backbone reserved event names such as 'change'.
 * 
 * @param {String} eventName
 * @param {Socket.io Object} io
 * @param {Function} callback
 * @param {Object} context (optional): Object to interpret as this on callback. Binds to model instance if not provided.
 * 
 * Example Assumptions:
 * 
 * * Model definition has url: my_model
 * * Model instance has id: abc123
 * 
 * Create a new bind (client-side):
 * 
 *     model.ioBind('update', this.updateView, this);
 * 
 * Send socket.io message (server-side)
 * 
 *     socket.emit( 'my_model/abc123:update', 
 *                 { title: 'My New Title' } );
 * 
 */

Backbone.Model.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {}),
      globalName = this.url() + ':' + eventName,
      self = this;
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function (data) {
      self.trigger(eventName, data);
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
 * Unbind model triggers and stop listening for server events
 * for a specific event and optional callback. If callback not
 * provide will remove all callbacks for eventname.
 * 
 * @param {String} eventName
 * @param {Socket.io Object} io
 * @param {Function} callback (optional)
 * 
 */
 
Backbone.Model.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {}),
      globalName = this.url() + ':' + eventName,
      self = this;
  var events = ioEvents[eventName];
  if (!_.isEmpty(events)) {
    if (callback && 'function' === typeof callback) {
      for (var i = 0, l = events.length; i < l; i++) {
        if (callback == events[i].cbLocal) {
          this.unbind(events[i].name, events[i].cbLocal);
          window.io.removeListener(events[i].global, events[i].cbGlobal);
          events[i] = false;
        }
      }
      _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};

/**
 * Unbind all callbacks and server listening events
 * for the given model.
 * 
 * @param {Socket.io Object} io
 * 
 */
 
Backbone.Model.prototype.ioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};

/*!
 * backbone.iobind - Collection
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */
 
/**
 * Bind and handle trigger of socket.io event.
 * 
 * Do not use Backbone reserved event names such as 'change'.
 * 
 * @param {String} eventName
 * @param {Socket.io Object} io
 * @param {Function} callback
 * @param {Object} context (optional): Object to interpret as this on callback. Binds to model instance if not provided.
 * 
 * Example Assumptions:
 * 
 * * Model definition has url: my_model
 * * Model instance has id: abc123
 * 
 * Create a new bind (client-side):
 * 
 *     model.ioBind('update', this.updateView, this);
 * 
 * Send socket.io message (server-side)
 * 
 *     socket.emit( 'my_model/abc123:update', 
 *                 { title: 'My New Title' } );
 * 
 */
 
Backbone.Collection.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {}),
      globalName = this.url + ':' + eventName,
      self = this;
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function (data) {
      self.trigger(eventName, data);
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
 * Unbind model triggers and stop listening for server events
 * for a specific event and optional callback. If callback not
 * provide will remove all callbacks for eventname.
 * 
 * @param {String} eventName
 * @param {Socket.io Object} io
 * @param {Function} callback (optional)
 * 
 */
 
Backbone.Collection.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {}),
      globalName = this.url + ':' + eventName,
      self = this;
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
      _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};

/**
 * Unbind all callbacks and server listening events
 * for the given model.
 * 
 * @param {Socket.io Object} io
 * 
 */
 
Backbone.Collection.prototypeioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};

