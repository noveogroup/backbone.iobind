var assert = require("assert"),
_ = require("underscore"),
Backbone = require("../dist/backbone.iosync");


describe('Backbone.sync', function(){
  var Library = Backbone.Collection.extend({
    url : function() { return '/library'; }
  });
  var library;
  var attrs = {
    title  : "The Tempest",
    author : "Bill Shakespeare",
    length : 123
  };

  beforeEach(function(){
    library = new Library;
    //emulation of socket.io 'emit'
    Backbone.socket = {
      path: '',
      data: null,
      emit: function(path, data){
        Backbone.socket.path = path;
        Backbone.socket.data = data;
      }
    };
  })

  it("create", function() {
    //library = new Library;
    library.create(attrs, {wait: false});
    assert.equal(Backbone.socket.path, 'library:create');
    assert.ok(_.isEqual(Backbone.socket.data, attrs));
  })

  it("read", function(){
    library.fetch();
    assert.equal(Backbone.socket.path, 'library:read');
    assert.ok(_.isEmpty(Backbone.socket.data));
  })
  it("passing data", function() {
    library.fetch({data: {a: 'a', one: 1}});
    assert.equal(Backbone.socket.path, 'library:read');
    assert.equal(Backbone.socket.data.a, 'a');
    assert.equal(Backbone.socket.data.one, 1);
  });

  it("update", function() {
    library.create(attrs, {wait: false});
    library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
    assert.equal(Backbone.socket.path, 'library:update');
    var data = Backbone.socket.data;
    assert.equal(data.id, '1-the-tempest');
    assert.equal(data.title, 'The Tempest');
    assert.equal(data.author, 'William Shakespeare');
    assert.equal(data.length, 123);
  });

  it("read model", function() {
    library.create(attrs, {wait: false});
    library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
    library.first().fetch();
    assert.equal(Backbone.socket.path, 'library:read');
    assert.equal(Backbone.socket.data.id, '2-the-tempest');
  });

  it("destroy", function() {
    library.create(attrs, {wait: false});
    library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
    library.first().destroy({wait: true});
    assert.equal(Backbone.socket.path, 'library:delete');
    assert.equal(Backbone.socket.data.id, '2-the-tempest');
  });

  it("urlError", function() {
    var model = new Backbone.Model();
    assert.throws(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    assert.equal(Backbone.socket.path, 'one:read');
  });

  it("#1052 - `options` is optional.", function() {
    var model = new Backbone.Model();
    model.url = '/test';
    Backbone.sync('create', model);
    assert.equal(Backbone.socket.path, 'test:create');
  });

  it("Custom method", function() {
    var model = new Backbone.Model();
    model.url = '/test';
    Backbone.sync('test_method', model);
    assert.equal(Backbone.socket.path, 'test:test_method');
  });

  it("patch", function() {
    library.create({id: 'patch-id', title  : "The Tempest", author : "Bill Shakespeare"}, {wait: false});
    library.first().save({author: 'Tim Shakespeare'}, {patch: true});
    
    assert.equal(Backbone.socket.path, 'library:patch');
    assert.equal(Backbone.socket.data.id, 'patch-id');
    assert.equal(Backbone.socket.data.author, 'Tim Shakespeare');
    assert.equal(Backbone.socket.data.title, null);
  });

})