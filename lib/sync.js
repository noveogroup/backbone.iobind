/*!
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

/**
 * Replaces default Backbone.sync function with socket.io
 * 
 * ## Assumptions
 * 
 * Currently expects active socket to be located at
 * `window.socket` or `Backbone.socket`. See inline comments
 * if you want to change it.
 * 
 * ## Server Side
 * 
 * socket.on('todos:create', function (data, fn) {
 *  ...
 *  fn(null, todo);
 * });
 * socket.on('todos:read', function (data, fn) { ... });
 * socket.on('todos:update', function (data, fn) { ... });
 * socket.on('todos:delete', function (data, fn) { ... });
 * 
 */

Backbone.sync = function (method, model, options) {
  var getUrl = function (object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  var cmd = getUrl(model).split('/'),
      namespace = cmd[0];

  var params = _.extend({
    req: namespace + ':' + method
  }, options);

  params.data = model.toJSON() || {};
  
  // If your socket.io connection exists on a different var, change here: 
  var io = window.socket || Backbone.socket;

  io.emit(namespace + ':' + method, params.data, function (err, data) {
    if (err) {
      options.error(err);
    } else {
      options.success(data);
    }
  });
};