// Entries.Views.StoriesIndex = Backbone.View.extend({

//   template: JST['stories/index']

// });



// Originally in assets/javascripts/application.js
// The Application
// ---------------
// $(function() {

// Our overall **AppView** is the top-level piece of UI.
// app.AppView = Backbone.View.extend({
app.StoryAppView = Backbone.View.extend({
  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#storyapp',

  // Our template for the line of statistics at the bottom of the app.
  statsTemplate: _.template( $('#stats-template').html() ),

  // New
  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-story': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the `Entries`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting entries that might be saved in *localStorage*.
  initialize: function() {
    if (!_.isUndefined(arguments[0].user_id)) {
      this.user_id = arguments[0].user_id;
    }
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-story');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Stories, 'add', this.addOne);
    this.listenTo(app.Stories, 'reset', this.addAll);

    // New
    this.listenTo(app.Stories, 'change:completed', this.filterOne);
    this.listenTo(app.Stories, 'filter', this.filterAll);
    this.listenTo(app.Stories, 'all', this.render);

    // alert("in initialize, before Entries.fetch()");
    app.Stories.fetch();
  },

  // New
  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var completed = app.Stories.completed().length;
    var remaining = app.Stories.remaining().length;

    if ( app.Stories.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.StoryFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single entry item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( story ) {
    var view = new app.StoryView({ model: story });
    $('#story-list').append( view.render().el );
  },

  // Add all items in the **Entries** collection at once.
  addAll: function() {
    this.$('#story-list').html('');
    app.Stories.each(this.addOne, this);
  },

  // New
  filterOne : function (story) {
    story.trigger('visible');
  },

  // New
  filterAll : function () {
    app.Stories.each(this.filterOne, this);
  },


  // New
  // Generate the attributes for a new Entry item.
  newAttributes: function() {
    // debugger;
    return {
      // title: this.$input.val().trim(),
      title: this.$input.val().trim(),
      description: this.$input.val().trim(),
      user_id: this.user_id,
      order: app.Stories.nextOrder(),
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

    app.Stories.create( this.newAttributes(), { wait: true } );
    // debugger;
    this.$input.val('');
  },

  // New
  // Clear all completed entry items, destroying their models.
  clearCompleted: function() {
    _.invoke(app.Stories.completed(), 'destroy');
    return false;
  },

  // New
  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Stories.each(function( story ) {
      story.save({
        'completed': completed
      });
    });
  }
});

// $(function() {

//   // // Kick things off by creating the **App**.
//   // // var myApp = new app.AppView();
//    var myApp = new app.StoryAppView();
//   // // var myApp = new app.AppView(<%= story_id %>);
//   // // myApp.initialize();
// });
