// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require underscore
//= require backbone
//= require entries

//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers

var app = app || {};
var ENTER_KEY = 13;


// The Application
// ---------------
$(function() {

// Our overall **AppView** is the top-level piece of UI.
app.AppView = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#entryapp',

  // Our template for the line of statistics at the bottom of the app.
  statsTemplate: _.template( $('#stats-template').html() ),

  // New
  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-entry': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the `Entries`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting entries that might be saved in *localStorage*.
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-entry');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Entries, 'add', this.addOne);
    this.listenTo(app.Entries, 'reset', this.addAll);

    // New
    this.listenTo(app.Entries, 'change:completed', this.filterOne);
    this.listenTo(app.Entries, 'filter', this.filterAll);
    this.listenTo(app.Entries, 'all', this.render);

    // alert("in initialize, before Entries.fetch()");
    app.Entries.fetch();
  },

  // New
  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var completed = app.Entries.completed().length;
    var remaining = app.Entries.remaining().length;

    if ( app.Entries.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.EntryFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single entry item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( entry ) {
    var view = new app.EntryView({ model: entry });
    $('#entry-list').append( view.render().el );
  },

  // Add all items in the **Entries** collection at once.
  addAll: function() {
    this.$('#entry-list').html('');
    app.Entries.each(this.addOne, this);
  },

  // New
  filterOne : function (entry) {
    entry.trigger('visible');
  },

  // New
  filterAll : function () {
    app.Entries.each(this.filterOne, this);
  },


  // New
  // Generate the attributes for a new Entry item.
  newAttributes: function() {
    // debugger;
    return {
      // title: this.$input.val().trim(),
      description: this.$input.val().trim(),
      order: app.Entries.nextOrder(),
      completed: false
    };
  },

  // New
  // If you hit return in the main input field, create new Entry model,
  // persisting it to localStorage.
  createOnEnter: function( event ) {
    // alert("in create on Enter");
    // debugger;
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }

    app.Entries.create( this.newAttributes(), { wait: true } );
    // debugger;
    this.$input.val('');
  },

  // New
  // Clear all completed entry items, destroying their models.
  clearCompleted: function() {
    _.invoke(app.Entries.completed(), 'destroy');
    return false;
  },

  // New
  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Entries.each(function( entry ) {
      entry.save({
        'completed': completed
      });
    });
  }
});


  // Kick things off by creating the **App**.
  var myApp = new app.AppView();
  // var myApp = new app.AppView(<%= story_id %>);
  // myApp.initialize();
});
