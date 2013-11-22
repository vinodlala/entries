var app = app || {};

// Entry Item View
// --------------

// The DOM element for an entry item...
app.EntryView = Backbone.View.extend({

  //... is a list tag.
  tagName: 'li',

  // Cache the template function for a single item.
  template: _.template( $('#item-template').html() ),

  // The DOM events specific to an item.
  events: {
    'click .toggle': 'togglecompleted', // NEW
    'dblclick label': 'edit',
    'click .destroy': 'clear',           // NEW

    'click .goto': 'goToEntry',           // NEW


    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // The EntryView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between an **Entry** and an **EntryView** in this
  // app, we set a direct reference on the model for convenience.
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);        // NEW
    this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
  },

  // Re-renders the titles of the entry item.
  render: function() {
    // debugger;
    this.$el.html( this.template( this.model.toJSON() ) );

    this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
    this.toggleVisible();                                             // NEW

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
      (!isCompleted && app.EntryFilter === 'completed') || (isCompleted && app.EntryFilter === 'active')
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
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
  clear: function() {
    this.model.destroy();
  },
  goToEntry: function () {
    // debugger;
    // app.StoryRouter.route("stories/1");
    // alert("stories.js - goToEntry - this.model: " + this.model);

    // alert("stories.js - goToEntry - this.model.id: " + this.model.id);

    // alert("stories.js - goToEntry - this.model.story_id: " + this.model.story_id);

    // alert("stories.js - goToEntry - this.model.collection.story_id: " + this.model.collection.story_id);

    // alert("stories.js - goToEntry - this.collection.story_id: " + this.collection.story_id);
    // debugger;

    theroute = 'stories/' + this.model.collection.story_id + '/entries/' + this.model.id + '/comments';
    //alert("stories.js - goToStory - theroute:" + theroute);
    // app.EntryRouter.navigate(theroute, {trigger:true});

    // making one router only, story router
    app.StoryRouter.navigate(theroute, {trigger:true});

  }
});
