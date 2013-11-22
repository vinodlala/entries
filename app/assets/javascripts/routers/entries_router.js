var Workspace2 = Backbone.Router.extend({
  routes:{
    // 'stories/:story_id/entries/:entry_id/comments': 'entries',
    // '*filter': 'setFilter'




  },

  setFilter: function( param ) {
    // Set the current filter to be used
    if (param) {
      param = param.trim();
    }
    app.EntryFilter = param || '';

    // // Trigger a collection filter event, causing hiding/unhiding
    // // of Todo view items
    // app.Entries.trigger('filter');
  },
  entries: function (story_id, entry_id) {
    // debugger;
    console.log(window.location);
    // debugger;

    //alert("stories_router id: " + id);
    window.location = "/stories/"+story_id+"/entries/"+entry_id+"/comments";
      // this.navigate("1/entries");


  }
});

// app.EntryRouter = new Workspace2();
// Backbone.history.start();
// Backbone.history.start({pushState: true});
