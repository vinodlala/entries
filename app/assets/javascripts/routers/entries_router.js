var Workspace = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },

  setFilter: function( param ) {
    // Set the current filter to be used
    if (param) {
      param = param.trim();
    }
    app.EntryFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    app.Entries.trigger('filter');
  }
});

app.EntryRouter = new Workspace();
// Backbone.history.start();
Backbone.history.start({pushState: true});
