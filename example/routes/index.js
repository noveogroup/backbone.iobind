
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

var vendorJs = new folio.glossary([
  require.resolve('jq/dist/jquery.js'),
  require.resolve('underscore/underscore.js'),
  require.resolve('backbone/backbone.js'),
  path.join(__dirname, '..', '..', 'backbone.iosync.js'),
  path.join(__dirname, '..', '..', 'backbone.iobind.js')
]);

exports.vendorjs = folio.serve(vendorJs);

/**
 * Template Javascript Package
 * 
 * compile jade
 */

var templateJs = new folio.glossary([
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

exports.templatejs = folio.serve(templateJs);

