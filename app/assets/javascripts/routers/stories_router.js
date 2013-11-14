var Workspace = Backbone.Router.extend({
  routes:{
    'stories/:id/entries': 'stories',
    '*filter': 'setFilter'
  },

  setFilter: function( param ) {

    debugger;

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

    alert("stories_router id: " + id);
    window.location = "/stories/"+id+"/entries";
      // this.navigate("1/entries");


  }
});

app.StoryRouter = new Workspace();
// Backbone.history.start();
// Backbone.history.start({pushState: true});
