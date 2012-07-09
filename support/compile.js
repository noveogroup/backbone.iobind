var path = require('path'),
    fs = require('fs'),
    color = require('colors'),
    folio = require('folio');

var version = require('../package.json').version;

var Glossary = folio.Glossary;

var about = [
  '',
  '  |_  _. _ | |_  _ ._  _ '.blue +'   o _ |_ o._  _|'.green + '  Backbone.ioBind'.grey,
  '  |_)(_|(_ |<|_)(_)| |(/_'.blue + ' o '.red + '|(_)|_)|| |(_|'.green,
  ''
].join('\n');

console.log(about);

var iobind = new Glossary([
  path.join(__dirname, '..', 'lib', 'model.js'),
  path.join(__dirname, '..', 'lib', 'collection.js')
], {
  prefix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'prefix.js'), 'utf8'),
  suffix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'suffix.js'), 'utf8')
});

iobind.compile(function (err, source) {
  source = source.replace(/@VERSION/g, version);
  fs.writeFileSync(path.join(__dirname, '..', 'dist', 'backbone.iobind.js'), source);
  console.log('Build successful: '.green + '\tdist/backbone.iobind.js'.blue);
});


var iobindmin = new Glossary([
  path.join(__dirname, '..', 'lib', 'model.js'),
  path.join(__dirname, '..', 'lib', 'collection.js')
], {
  minify: true,
  prefix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'prefix.js'), 'utf8'),
  suffix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'suffix.js'), 'utf8')
});

iobindmin.compile(function (err, source) {
  source = source.replace(/@VERSION/g, version);
  var copyright = fs.readFileSync(path.join(__dirname, '..', 'lib', 'copyright.js'));
  fs.writeFileSync(path.join(__dirname, '..', 'dist', 'backbone.iobind.min.js'), copyright + '\n' + source);
  console.log('Build successful: '.green + '\tdist/backbone.iobind.min.js'.blue);
});

var iosync = new Glossary([
  path.join(__dirname, '..', 'lib', 'sync.js')
], {
  prefix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'prefix.js'), 'utf8'),
  suffix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'suffix.js'), 'utf8')
});

iosync.compile(function (err, source) {
  fs.writeFileSync(path.join(__dirname, '..', 'dist', 'backbone.iosync.js'), source);
  console.log('Build successful: '.green + '\tdist/backbone.iosync.js'.blue);
});

var iosyncmin = new Glossary([
  path.join(__dirname, '..', 'lib', 'sync.js')
], {
  minify: true,
  prefix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'prefix.js'), 'utf8'),
  suffix: fs.readFileSync(path.join(__dirname, '..', 'lib', 'suffix.js'), 'utf8')
});

iosyncmin.compile(function (err, source) {
  var copyright = fs.readFileSync(path.join(__dirname, '..', 'lib', 'copyright.js'));
  fs.writeFileSync(path.join(__dirname, '..', 'dist', 'backbone.iosync.min.js'), copyright + '\n' + source);
  console.log('Build successful: '.green + '\tdist/backbone.iosync.min.js'.blue);
});
