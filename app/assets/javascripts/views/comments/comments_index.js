// This is the view for a bunch of comments

// Entries.Views.EntriesIndex = Backbone.View.extend({

//   template: JST['entries/index']

// });



// Originally in assets/javascripts/application.js
// The Application
// ---------------
// $(function() {

// Our overall **AppView** is the top-level piece of UI.
// app.AppView = Backbone.View.extend({
app.CommentAppView = Backbone.View.extend({
  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#storyapp',

  // Our template for the line of statistics at the bottom of the app.
  // statsTemplate: _.template( $('#stats-template').html() ),
  statsTemplate: _.template( $('#stats-template-comments').html() ),

  // New
  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-comment': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the `Entries`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting entries that might be saved in *localStorage*.
  initialize: function() {
    // debugger
    if (!_.isUndefined(arguments[0].user_id)) {
      this.user_id = arguments[0].user_id;
    }

    if (!_.isUndefined(arguments[0].entry_description)) {
      this.entry_description = arguments[0].entry_description;
    }
    // this

    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-comment');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Comments, 'add', this.addOne);
    this.listenTo(app.Comments, 'reset', this.addAll);
    this.listenTo(app.Comments, 'sync', function (req){
      // if (req.collection){
      //   app.Stories.add(req);
      // }
      // }
      // console.log('just added: '+req.id);
    });

    this.$('#new-story').hide();
    this.$('#new-entry').hide();
    this.$('#new-comment').show();

    // New
    this.listenTo(app.Comments, 'change:completed', this.filterOne);
    this.listenTo(app.Comments, 'filter', this.filterAll);
    this.listenTo(app.Comments, 'all', this.render);

    //alert("in entries_index initialize, before Entries.fetch()");
    // alert(app.Entries);
    // debugger;
    // alert(app.Entries[story_id]);
    app.Comments.fetch();

// debugger;
    // alert("after fetch, before #headerEntry fill in");

    // this.$('#headerEntry').show();


    // $('#headerTitle').html(this.entry_description);
    $('#headerEntry').html("Entry being commented on:<br><br><br>" + this.entry_description + "<br><br><br>");
    $('#headerEntry').show();
    $('#headerStory').hide();
    $('#info').hide();
    $('#infoEntries').hide();
    $('#infoComments').show();
    // alert("after #headerEntry filled in");
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
    console.log("comments index render called");
    // debugger;
    // var completed = app.Entries.where({story_id: 3}).completed().length;
    // var remaining = app.Entries.where({story_id: 3}).remaining().length;
    var completed = app.Comments.completed().length;
    var remaining = app.Comments.remaining().length;

    if ( app.Comments.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.CommentFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      // vin 12/3 trying to make entry appear at top of comments index
      // this.$main.hide();
      this.$footer.hide();
    }

    this.addAll();
    // this.allCheckbox.checked = !remaining;
  },

  // Add a single entry item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( comment ) {
    // debugger;
    console.log("comments_index addOne");
    var view = new app.CommentView({ model: comment });
    $('#story-list').append( view.render().el );
  },

  // Add all items in the **Comments** collection at once.
  addAll: function() {
    // debugger;
    console.log("comments_index addAll");
    $('#story-list').html('');
    // this.$('#story-list').html('');

    // $('#story-list').html('<li><div class="view"><div><label id="headerEntry"></label></div></div></li>');



    // this.$('#comment-list').html('');
    app.Comments.each(this.addOne, this);
  },

  // New
  filterOne : function (comment) {
    comment.trigger('visible');
  },

  // New
  filterAll : function () {
    app.Comments.each(this.filterOne, this);
  },


  // New
  // Generate the attributes for a new Entry item.
  newAttributes: function() {
    // debugger;
    return {
      // title: this.$input.val().trim(),
      title: app.Comments.title, // Vin 12/5
      description: this.$input.val().trim(),
      //
      //
      user_id: this.user_id,
      entry_id: app.Comments.entry_id,
      story_id: app.Comments.story_id,
      order: app.Comments.nextOrder(),
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
    debugger;
    app.Comments.create( this.newAttributes(), { wait: true } );
    debugger;
    this.$input.val('');

    // this.$input.val('Click here, type a comment and press ENTER to add a new comment to the paragraph entry.');
    this.$input.attr("placeholder", "Click here, type a comment and press ENTER to add a new comment to the paragraph entry.");
  },

  // New
  // Clear all completed entry items, destroying their models.
  clearCompleted: function() {
    _.invoke(app.Comments.completed(), 'destroy');
    return false;
  },

  // New
  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Comments.each(function( comment ) {
      comment.save({
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
