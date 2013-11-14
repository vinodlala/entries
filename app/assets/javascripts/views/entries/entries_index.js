// Entries.Views.EntriesIndex = Backbone.View.extend({

//   template: JST['entries/index']

// });



// Originally in assets/javascripts/application.js
// The Application
// ---------------
// $(function() {

// Our overall **AppView** is the top-level piece of UI.
// app.AppView = Backbone.View.extend({
app.EntryAppView = Backbone.View.extend({
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

    //alert("in entries_index initialize, before Entries.fetch()");
    // alert(app.Entries);
    // debugger;
    // alert(app.Entries[story_id]);
    app.Entries.fetch();
    // app.Entries.fetch( {data: {id: 2} });
    //alert(app.Entries);

    // alert(app.Entries[story_id]);
    // alert(app.Entries.where({story_id:3}));

    // app.Entries.fetch({id:2});
  },

  // New
  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {

    // var completed = app.Entries.where({story_id: 3}).completed().length;
    // var remaining = app.Entries.where({story_id: 3}).remaining().length;
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
      user_id: 1,
      story_id: app.Entries.story_id,
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

// $(function() {

//   // Kick things off by creating the **App**.
//   // var myApp = new app.AppView();
//   var myApp = new app.EntryAppView();
//   // var myApp = new app.AppView(<%= story_id %>);
//   // myApp.initialize();
// });
