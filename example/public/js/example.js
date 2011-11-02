
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

window.socket = io.connect('http://localhost');

log(window.socket);

// We are going to call our app 'Minimal'.
var Minimal = {};

Minimal.App = Backbone.Router.extend({
  routes: {
    '': 'index',
    '/': 'index'
  },
  index: function () {
    var todos = new Minimal.Todos();
    
    var form = new Minimal.TodoListForm(todos);
    $('#TodoWrapper').append(form.el);
    
    var list = new Minimal.TodoList(todos);
    $('#TodoWrapper').append(list.el);
    
    todos.fetch();
  }
});

Minimal.Todo = Backbone.Model.extend({
  urlRoot: 'todo',
  noIoBind: false,
  initialize: function () {
    _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
    
    // if we are creating a new model to push to the server we don't want
    // to iobind as we only bind new models from the server
    if (!this.noIoBind) {
      this.ioBind('update', window.socket, this.serverChange, this);
      this.ioBind('delete', window.socket, this.serverDelete, this);
    }
  },
  serverChange: function (data) {
    // Useful to prevent loops when dealing with client-side updates (ie: forms).
    log('change', data);
    data.fromServer = true;
    this.set(data);
  },
  serverDelete: function (data) {
    if (this.collection) {
      this.collection.remove(this);
    } else {
      this.trigger('remove', this);
    }
    this.modelCleanup();
  },
  modelCleanup: function () {
    this.ioUnbindAll(window.socket);
    return this;
  }
});

Minimal.Todos = Backbone.Collection.extend({
  model: Minimal.Todo,
  url: 'todos',
  initialize: function () {
    _.bindAll(this, 'serverCreate', 'collectionCleanup');
    this.ioBind('create', window.socket, this.serverCreate, this);
  },
  serverCreate: function (data) {
    // make sure no duplicates, just in case
    var exists = this.get(data.id);
    if (!exists) {
      this.add(data);
    } else {
      data.fromServer = true;
      exists.set(data);
    }
  },
  collectionCleanup: function (callback) {
    this.ioUnbindAll(window.socket);
    this.each(function (model) {
      model.modelCleanup();
    });
    return this;
  }
});

Minimal.TodoList = Backbone.View.extend({
  id: 'TodoList',
  initialize: function(todos) {
    _.bindAll(this, 'render', 'addTodo', 'removeTodo');
    
    this.todos = todos;
    this.todos.bind('reset', this.render);
    this.todos.bind('add', this.addTodo);
    this.todos.bind('remove', this.removeTodo);
    this.render();
  },
  render: function () {
    var self = this;
    
    this.todos.each(function (todo) {
      self.addTodo(todo);
    });
    
    return this;
  },
  addTodo: function (todo) {
    var tdv = new Minimal.TodoListItem(todo);
    $(this.el).append(tdv.el);
  },
  removeTodo: function (todo) {
    var self = this
      , width = this.$('#' + todo.id).outerWidth();
    
    // ooh, shiny animation!
    this.$('#' + todo.id).css('width', width + 'px');
    this.$('#' + todo.id).animate({
      'margin-left': width,
      'opacity': 0
    }, 200, function () {
        self.$('#' + todo.id).animate({
          'height': 0
        }, 200, function () {
            self.$('#' + todo.id).remove();
          });
      });
  }
});

Minimal.TodoListItem = Backbone.View.extend({
  className: 'todo',
  events: {
    'click .complete': 'completeTodo',
    'click .delete': 'deleteTodo'
  },
  initialize: function (model) {
    _.bindAll(this, 'setStatus', 'completeTodo', 'deleteTodo');
    this.model = model;
    this.model.bind('change:completed', this.setStatus);
    this.render();
  },
  render: function () {
    $(this.el).html(template.item(this.model.toJSON()));
    $(this.el).attr('id', this.model.id);
    this.setStatus();
    return this;
  },
  setStatus: function () {
    var status = this.model.get('completed');
    if (status) {
      $(this.el).addClass('complete');
    } else {
      $(this.el).removeClass('complete');
    }
  },
  completeTodo: function () {
    var status = this.model.get('completed');
    this.model.save({ completed: !!!status });
  },
  deleteTodo: function () {
    this.model.destroy({ silent: true });
  }
});

Minimal.TodoListForm = Backbone.View.extend({
  id: 'TodoForm',
  events: {
    'click .button#add': 'addTodo'
  },
  initialize: function (todos) {
    _.bindAll(this, 'addTodo');
    this.todos = todos;
    this.render();
  },
  render: function () {
    $(this.el).html(template.form());
    return this;
  },
  addTodo: function () {
    var Todo = Minimal.Todo.extend({ noIoBind: true });
    
    var attrs = {
      title: this.$('#TodoInput input[name="TodoInput"]').val(),
      completed: false
    };
    
    this.$('#TodoInput input[name="TodoInput"]').val('');
    
    var _todo = new Todo(attrs);
    _todo.save();
  }
});

$(document).ready(function () {
  window.app = new Minimal.App();
  Backbone.history.start();
});