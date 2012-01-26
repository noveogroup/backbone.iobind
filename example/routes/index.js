
var path = require('path')
  , folio = require('folio')
  , jade = require('jade');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Done.', layout: false });
};


/**
 * Vendor Javascript Package
 *
 * jquery
 * underscore
 * backbone
 * backbone.iosync
 * backbone.iobind
 */

var vendorJs = new folio.Glossary([
  path.join(__dirname, '..', 'public', 'js', 'jquery.min.js'),
  require.resolve('underscore/underscore.js'),
  require.resolve('backbone/backbone.js'),
  path.join(__dirname, '..', '..', 'dist', 'backbone.iosync.js'),
  path.join(__dirname, '..', '..', 'dist', 'backbone.iobind.js')
]);

// serve using express
exports.vendorjs = folio.serve(vendorJs);

/**
 * Template Javascript Package
 *
 * We are going to use pre-compiled
 * jade on the client-side.
 */

var templateJs = new folio.Glossary([
  require.resolve('jade/runtime.js'),
  path.join(__dirname, '..', 'views/templates/js/header.js'),
  path.join(__dirname, '..', 'views/templates/form.jade'),
  path.join(__dirname, '..', 'views/templates/item.jade')
], {
  compilers: {
    jade: function (name, source) {
      return 'template[\'' + name + '\'] = ' +
        jade.compile(source, {
          client: true,
          compileDebug: false
        }) + ';';
    }
  }
});

// serve using express
exports.templatejs = folio.serve(templateJs);

