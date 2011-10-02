var path = require('path'),
    fs = require('fs'),
    color = require('colors'),
    codex = require('codex');

var about = [
  '',
  '  |_  _. _ | |_  _ ._  _ '.blue +'   o _ |_ o._  _|'.green + '  Backbone.ioBind'.grey,
  '  |_)(_|(_ |<|_)(_)| |(/_'.blue + ' o '.red + '|(_)|_)|| |(_|'.green,
  ''
].join('\n');

console.log(about);


desc('About this tool.');
task('default', function() {
  console.log('jake -T'.white + ' for all commands'.grey);
  console.log('jake' + ' build:all'.green + ' to get started'.grey);
});

namespace('build', function () {
  desc('Build all files.');
  task('all', function () {
    console.log('Initiating full build cycle...\n');
    jake.Task['build:backbone.iobind.js'].invoke();
    jake.Task['build:backbone.iobind.min.js'].invoke();
    jake.Task['build:backbone.iosync.js'].invoke();
    jake.Task['build:backbone.iosync.min.js'].invoke();
  });

  desc('Build model & collection ioBindings');
  file({'backbone.iobind.js': ['lib/copyright.js', 'lib/model.js', 'lib/collection.js']}, function () {
    var binding = new codex.binding([
        path.join(__dirname, 'lib', 'copyright.js'),
        path.join(__dirname, 'lib', 'model.js'),
        path.join(__dirname, 'lib', 'collection.js')
      ]);
    
    binding.compile(function (err, source) {
      fs.writeFileSync(path.join(__dirname, 'backbone.iobind.js'), source);
      console.log('Build successful: '.green + '\tbackbone.iobind.js'.blue);
    });
  });
  
  desc('Minify model & collection ioBindings');
  file({'backbone.iobind.min.js': ['lib/copyright.js', 'lib/model.js', 'lib/collection.js']}, function () {
    var binding = new codex.binding([
        path.join(__dirname, 'lib', 'model.js'),
        path.join(__dirname, 'lib', 'collection.js')
      ], { minify: true });
    
    binding.compile(function (err, source) {
      var copyright = fs.readFileSync(path.join(__dirname, 'lib', 'copyright.js'));
      fs.writeFileSync(path.join(__dirname, 'backbone.iobind.min.js'), copyright + '\n' + source);
      console.log('Build successful: '.green + '\tbackbone.iobind.min.js'.blue);
    });
  });
  
  desc('Build Backbone.sync replacement');
  file({'backbone.iosync.js': ['lib/copyright.js', 'lib/sync.js']}, function () {
    var binding = new codex.binding([
        path.join(__dirname, 'lib', 'copyright.js'),
        path.join(__dirname, 'lib', 'sync.js')
      ]);
    
    binding.compile(function (err, source) {
      fs.writeFileSync(path.join(__dirname, 'backbone.iosync.js'), source);
      console.log('Build successful: '.green + '\tbackbone.iosync.js'.blue);
    });
  });
  
  desc('Minify Backbone.sync replacement');
  file({'backbone.iosync.min.js': ['lib/copyright.js', 'lib/sync.js']}, function () {
    var binding = new codex.binding([
        path.join(__dirname, 'lib', 'sync.js')
      ], { minify: true });
    
    binding.compile(function (err, source) {
      var copyright = fs.readFileSync(path.join(__dirname, 'lib', 'copyright.js'));
      fs.writeFileSync(path.join(__dirname, 'backbone.iosync.min.js'), copyright + '\n' + source);
      console.log('Build successful: '.green + '\tbackbone.iosync.min.js'.blue);
    });
  });

});