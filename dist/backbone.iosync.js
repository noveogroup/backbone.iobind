(function (undefined) {
  // Common JS // require JS
  var _, $, Backbone, exports;
  if (typeof window === 'undefined' || typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    exports = Backbone;
    if (typeof module !== 'undefined') module.exports = exports;
  } else {
    $ = this.$;
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }


/*!
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


/**
 * # Backbone.sync
 *
 * Replaces default Backbone.sync function with socket.io transport
 *
 * ### Assumptions
 *
 * Currently expects active socket to be located at `window.socket`,
 * `Backbone.socket` or the sync'ed model own socket.
 * See inline comments if you want to change it.
 * ### Server Side
 *
 *     socket.on('todos:create', function (data, fn) {
 *      ...
 *      fn(null, todo);
 *     });
 *     socket.on('todos:read', ... );
 *     socket.on('todos:update', ... );
 *     socket.on('todos:delete', ... );
 *
 * @name sync
 */
Backbone.sync = function (method, model, options) {
  var getUrl = function (object) {

    if (options && options.url) {
      return _.result(options, 'url') || urlError();
    }
    
    if (object && object.url){
      return _.result(object, 'url') || urlError();
    }

    urlError();
  };

  var cmd = getUrl(model).split('/')
    , namespace = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

  var params = _.extend({
    req: namespace + ':' + method
  }, options);

  if ( !params.data && model ) {
    params.data = model.toJSON(options) || {};
  }

  // If your socket.io connection exists on a different var, change here:
  var io = model.socket || window.socket || Backbone.socket;

  var success = options.success;
  options.success = function(resp) {
    if (success) success(model, resp, options);
    model.trigger('sync', model, resp, options);
  };

  var error = options.error;
  options.error = function(err) {
    if (error) error(model, err, options);
    model.trigger('error', model, err, options);
  };

  var defer = $.Deferred();
  io.emit(namespace + ':' + method, params.data, function (err, data) {
    if (err) {
      options.error(err);
      defer.reject();
    } else {
      options.success(data);
      defer.resolve();
    }
  });
  promise = defer.promise();
  model.trigger('request', model, promise, options);
  return promise;
};


})();