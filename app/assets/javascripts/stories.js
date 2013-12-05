var app = app || {};

// This is the view for a single story
// --------------

// The DOM element for a story item...
app.StoryView = Backbone.View.extend({

  //... is a list tag.
  tagName: 'li',

  // Cache the template function for a single item.
  template: _.template( $('#story-template').html() ),

  // The DOM events specific to an item.
  events: {
    // 'click .toggle': 'togglecompleted', // NEW
    // 'dblclick label': 'edit',
    'click .destroy': 'clear',           // NEW

    // 'click .goto': 'goToStory',           // NEW


    // 'click .add-new-story-button': 'AddNewStory',
    'click .add-new-story-anchor': 'AddNewStory', //not working?

    // 'click .go-to-story-button': 'goToStory',
    'click .go-to-story-anchor': 'goToStoryEntries',

    // 'click .edit-info-about-story-button': 'editInfoAboutStory',
    'click .edit-info-about-story-anchor': 'editInfoAboutStory',
    // 'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // The StoryView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between an **Entry** and an **EntryView** in this
  // app, we set a direct reference on the model for convenience.
  initialize: function() {
    // debugger;
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);        // NEW
    // this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
  },

  // Re-renders the titles of the story item.
  render: function() {
    // debugger;
    this.$el.html( this.template( this.model.toJSON() ) );

    // this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
    // this.toggleVisible();                                             // NEW

    this.$input = this.$('.edit');
    return this;
  },

  // NEW - Toggles visibility of item
  toggleVisible : function () {
    this.$el.toggleClass( 'hidden',  this.isHidden());
  },

  // NEW - Determines if item should be hidden
  isHidden : function () {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.StoryFilter === 'completed') || (isCompleted && app.StoryFilter === 'active')
    );
  },

  // NEW - Toggle the `"completed"` state of the model.
  togglecompleted: function() {
    this.model.toggle();
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // Close the `"editing"` mode, saving changes to the entry.
  close: function() {
    // debugger;
    var value = this.$input.val().trim();

    // if ( value ) {
    //   this.model.save({ title: value });
    // }
    if ( value ) {
      this.model.save({ description: value });
    }


    this.$el.removeClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function( e ) {
    // debugger;
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
  clear: function() {
    this.model.destroy();
  },

  editInfoAboutStory: function () {
    theroute = '/stories/' + this.model.id + '/edit';
    app.StoryRouter.navigate(theroute, {trigger:true});
    window.location = theroute;
  },
  addNewStory: function () {
    // debugger;
    // app.StoryRouter.route("stories/1");
    //alert("stories.js - goToStory - this.model.id: " + this.model.id);

    debugger;
    theroute = '/stories/new';
    //alert("stories.js - goToStory - theroute:" + theroute);
    app.StoryRouter.navigate(theroute, {trigger:true});
    window.location = theroute;
    // app.StoryRouter.navigate(theroute);




  },
  goToStoryEntries: function () {
    // debugger;
    // app.StoryRouter.route("stories/1");
    //alert("stories.js - goToStory - this.model.id: " + this.model.id);

    theroute = 'stories/' + this.model.id + '/entries';
    //alert("stories.js - goToStory - theroute:" + theroute);


    // removing .navigate  so user does not save url vin 12/3
    // app.StoryRouter.navigate(theroute, {trigger:true});


    // app.StoryRouter.navigate(theroute);

    app.Entries = new EntryList(); // js/collections/entries.js

    app.Entries.story_id = this.model.id;

    // added title to entry list Vin 12/2

    debugger;
    // app.Entries.title = this.model.title;

    // debugger;
  // app.Entries.story_id = <%= @story.id %>;

    // var myApp2 = new app.EntryAppView({user_id: 66});

    // this works Vin 12/4
    // var myApp2 = new app.EntryAppView({story_title: this.model.get('title')});

    // trying this Vin 12/4
    // debugger;
    // this works for creator, not collaborators
    // var myApp2 = new app.EntryAppView({user_id: this.model.get('user_id'), story_title: this.model.get('title')});

    var myApp2 = new app.EntryAppView({user_id: this.model.get('user_id'),
      story_title: this.model.get('title'),
      collaborators_ids: this.model.get('collaborators_ids')
    });



    // var myApp2 = new app.EntryAppView({user_id: <%= current_user.id %>});

// $("#storyapp").html()


    // app.StoryAppView.remove();


  }
});
