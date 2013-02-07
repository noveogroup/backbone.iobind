(function (undefined) {
  // Common JS // require JS
  var _, $, Backbone, exports;
  if (typeof window === 'undefined' || typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    exports = Backbone;
    if (module) module.exports = exports;
  } else {
    $ = this.$;
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }
