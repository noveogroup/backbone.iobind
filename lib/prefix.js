(function (undefined) {
  // Common JS
  var _, Backbone, exports;
  if (typeof window === 'undefined') {
    _ = require('underscore');
    Backbone = require('backbone');
    exports = module.exports = Backbone;
  } else {
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }
