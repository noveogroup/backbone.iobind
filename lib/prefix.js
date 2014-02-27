
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
