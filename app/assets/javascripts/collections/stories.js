var app = app || {};

// Story Collection
// ---------------

// The collection of stories is backed by *localStorage* instead of a remote
// server.
var StoryList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: app.Story,

  // story_id: null,

  // Set the url property (or function) on a collection to reference its location on the server.
  url: '/stories',
  // url: function() {
  //   '/story/' + this.story_id + '/entries'
  // }

  // Filter down the list of all entry items that are finished.
  completed: function() {
    return this.filter(function( story ) {
      return story.get('completed');
    });
  },

  // Filter down the list to only entry items that are still not finished.
  remaining: function() {
    return this.without.apply( this, this.completed() );
  },

  // We keep the Entries in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function() {
    if ( !this.length ) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Entries are sorted by their original insertion order.
  comparator: function( entry ) {
    return entry.get('order');
  }
});

// Create our global collection of **Entries**.
app.Stories = new StoryList();
