// This is the view for a bunch of entries

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
  // el: '#entryapp',
  el: '#storyapp',

  // Our template for the line of statistics at the bottom of the app.
  // statsTemplate: _.template( $('#stats-template').html() ),
  statsTemplate: _.template( $('#stats-template-entries').html() ),

  // New
  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-entry': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete',


    // 'click .add-new-story-button': 'AddNewStory',
    // 'click .add-new-story-anchor': 'AddNewStory'
  },

  // At initialization we bind to the relevant events on the `Entries`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting entries that might be saved in *localStorage*.
  initialize: function() {
    // debugger;
    if (!_.isUndefined(arguments[0].user_id)) {
      this.user_id = arguments[0].user_id;
    }

    if (!_.isUndefined(arguments[0].story_title)) {
      this.story_title = arguments[0].story_title;
    }
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-entry');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    // added header reference for story title Vin 12/2
    this.$header = this.$('#header');


    this.listenTo(app.Entries, 'add', this.addOne);
    this.listenTo(app.Entries, 'reset', this.addAll);
    this.listenTo(app.Entries, 'sync', function (req){
      // if (req.collection){
      //   app.Stories.add(req);
      // }
      // }
      // console.log('just added: '+req.id);

    });

    this.$('#new-story').hide();
    // this.$('#new-entry').show();
    this.$('#new-comment').hide();

    // Vin 12/4 trying to show new-entry only for story writer/collaborators
    // alert("this.user_id");
    // alert(this.user_id);
    // alert("window.current_user");
    // alert(window.current_user);
    debugger;
    if (!_.isUndefined(arguments[0].story_title)) {
      this.story_title = arguments[0].story_title;
    }

    this.collaborators_ids = [];
    if (!_.isUndefined(arguments[0].collaborators_ids)) {
      this.collaborators_ids = arguments[0].collaborators_ids;
    }
    if (this.user_id == window.current_user) {
      this.$('#new-entry').show();
    } else {
      this.$('#new-entry').hide();
    }
    if (this.collaborators_ids.indexOf(window.current_user) > -1) {
      this.$('#new-entry').show();
    }

    // New
    this.listenTo(app.Entries, 'change:completed', this.filterOne);
    this.listenTo(app.Entries, 'filter', this.filterAll);
//Desmond test commented this out to try no render,
//strangely still rendered anyway, because of fetch?
    this.listenTo(app.Entries, 'all', this.render);

    //alert("in entries_index initialize, before Entries.fetch()");
    // alert(app.Entries);
    // debugger;
    // alert(app.Entries[story_id]);

//Desmond test commented this out to try success:
    app.Entries.fetch();
    app.Entries.story_title = this.story_title;
    // debugger;
    // added header reference for story title Vin 12/2
    // this.$headerTitle.html("app.Entries.title");
    // $('#headerTitle').html(app.Entries.model.get("title"));
    // $('#headerTitle').html(this.story_title);
    $('#headerStory').html(this.story_title);
    $('#headerStory').show();
    // $('#headerEntry').html("Title of story:<br>" + this.story_title);
    // $('#headerEntry').show();
    $('#headerEntry').hide();
    $('#info').hide();
    $('#infoEntries').show();
    $('#infoComments').hide();
    // app.Entries.fetch({
    //   success: function () {
    //     this.render;
    //   }
    // });

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
    console.log("entries index render called");
    // debugger;
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
      // vin 12/5 trying to make story title appear at top of entries index
      // this.$main.hide();
      this.$footer.hide();
    }

// added by Nimit
    this.addAll();
    // this.allCheckbox.checked = !remaining;
  },

  // Add a single entry item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( entry ) {
    // debugger;
    console.log("entries_index addOne");

    // this works but anyone can edit any entry
    var view = new app.EntryView({ model: entry });


    // trying to make it so only writer of entry can edit entry
    // var view = new app.EntryView({ model: entry, user_id: this.user_id });



    $('#story-list').append( view.render().el );
  },

  // Add all items in the **Entries** collection at once.
  addAll: function() {
    // debugger;
    console.log("entries_index addAll");
    $('#story-list').html('');
    // this.$('#entry-list').html('');
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
    debugger;
    return {
      // use title of story for title of entry
      // title: this.$input.val().trim(),
      // title: app.Entries.title, //doesn't work Vin 12/2
      title: app.Entries.story_title,
      description: this.$input.val().trim(),
      // code below does not work
      // user_id: this.user_id,
      user_id: app.Entries.user_id, // doesn't work Vin 12/2
      story_id: app.Entries.story_id,
      order: app.Entries.nextOrder(),
      completed: false
    };
  },

  // New
  // If you hit return in the main input field, create new Entry model,
  // persisting it to localStorage.
  createOnEnter: function( event ) {
    // alert("in createOnEnter");
    // debugger;
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }
    debugger;
    app.Entries.create( this.newAttributes(), { wait: true } );
    debugger;
    this.$input.val('');

    // this.$input.val('Click here, type a paragraph and press ENTER to add a new paragraph entry to the story.');
    this.$input.attr("placeholder", "Click here, type a comment and press ENTER to add a new comment to the paragraph entry.");
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
