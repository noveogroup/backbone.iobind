(function (undefined) {
  // Common JS // require JS
  var _, Backbone, exports;
  if (typeof window === 'undefined' || typeof require === 'function') {
    _ = require('underscore');
    Backbone = require('backbone');
    exports = module.exports = Backbone;
  } else {
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }
