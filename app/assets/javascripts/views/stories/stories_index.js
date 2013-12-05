// This is the view for a bunch of stories

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
  // statsTemplate: _.template( $('#stats-template').html() ),
  statsTemplate: _.template( $('#stats-template-stories').html() ),
  // New
  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-story': 'createOnEnter',

    // removing toggle all
    // 'click #clear-completed': 'clearCompleted',
    // 'click #toggle-all': 'toggleAllComplete',


    'click .add-new-story-button': 'AddNewStory', //doesn't work
    'click .add-new-story-anchor': 'AddNewStory'  //doesn't work

  },

  // At initialization we bind to the relevant events on the `Entries`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting entries that might be saved in *localStorage*.
  initialize: function() {
    // debugger;

    // list of stories not showing up when logged off because of undefined error here
    // if (!_.isUndefined(arguments[0].user_id)) {
    //   this.user_id = arguments[0].user_id;
    // }

    // removing toggle all - removing this makes only one story show up
    this.allCheckbox = this.$('#toggle-all')[0];


    this.$input = this.$('#new-story');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Stories, 'add', this.addOne);
    this.listenTo(app.Stories, 'reset', this.addAll);
    this.listenTo(app.Stories, 'sync', function (req){
      // if (req.collection){
      //   app.Stories.add(req);
      // }
      // }
      // console.log('just added: '+req.id);

    });


    this.$('#new-story').show();
    this.$('#new-entry').hide();
    this.$('#new-comment').hide();
    $('#headerStory').hide();
    $('#headerEntry').hide();
    $('#info').show();
    $('#infoEntries').hide();
    $('#infoComments').hide();

    // New
    this.listenTo(app.Stories, 'change:completed', this.filterOne);
    this.listenTo(app.Stories, 'filter', this.filterAll);
    //
    //
    this.listenTo(app.Stories, 'all', this.render);

    // alert("in initialize, before Entries.fetch()");
    // debugger;
    app.Stories.fetch();
    // debugger;

    $('#headerTitle').html("Story Stacker");


  },

  // New
  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    console.log("stories index render called");
    // debugger;

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

    // this.allCheckbox.checked = !remaining;
  },

  // Add a single entry item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( story ) {
    // debugger;
    var view = new app.StoryView({ model: story });
    $('#story-list').append( view.render().el );
  },

  // Add all items in the **Entries** collection at once.
  // never used Vin 12/2
  addAll: function() {
    // debugger;
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

    // app.Stories.create( this.newAttributes(), { wait: true } );
    // debugger
    var newStory = app.Stories.create( this.newAttributes(), { wait: true } );
    // var newStory = this.newAttributes();
    // app.Stories.create( this.newAttributes(), { wait: true } );


    // debugger;
    this.$input.val('');


    // window.location = "/stories/"+ newStory.id +"/edit";

  },


  addNewStory: function() {
    debugger;
    theroute = 'stories/new';
    app.StoryRouter.navigate(theroute, {trigger:true});
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
