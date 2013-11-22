var Workspace = Backbone.Router.extend({
  routes:{
    'stories/:id/entries': 'stories',
    // '*filter': 'setFilter'

    // making one router only, story router
    'stories/:story_id/entries/:entry_id/comments': 'entries'

  },

  setFilter: function( param ) {

    // debugger;

    // Set the current filter to be used
    if (param) {
      param = param.trim();
    }
    app.StoryFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    app.Stories.trigger('filter');
  },
  stories: function (id) {
    // debugger;
    console.log(window.location);
    // debugger;
    //alert("stories_router id: " + id);
    window.location = "/stories/"+id+"/entries";
      // this.navigate("stories/"+id+"/entries");
  },

// making one router only, story router
  entries: function (story_id, entry_id) {
    // debugger;
    console.log(window.location);
    // debugger;

    //alert("stories_router id: " + id);
    window.location = "/stories/"+story_id+"/entries/"+entry_id+"/comments";
      // this.navigate("1/entries");


  }




});

app.StoryRouter = new Workspace();
Backbone.history.start();
  // Backbone.history.start({pushState: true});
