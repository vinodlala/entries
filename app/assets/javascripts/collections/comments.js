var app = app || {};

// Comment Collection
// ---------------

// The collection of entries is backed by *localStorage* instead of a remote
// server.
var CommentList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: app.Comment,

  // story_id: null,
  // story_id: 2,


  // Set the url property (or function) on a collection to reference its location on the server.
  // url: '/entries',
  url: function() {
    // debugger;
    return '/stories/' + this.story_id + '/entries/' + this.entry_id + '/comments';
  },
  // url: function() {
  //   '/story/' + this.story_id + '/entries'
  // },
  // url: 'stories' + this.model.id  + '/entries',
  // url: 'stories' + 2 + '/entries',


  // Filter down the list of all comment items that are finished.
  completed: function() {
    return this.filter(function( comment ) {
      return comment.get('completed');
    });
  },

  // Filter down the list to only comment items that are still not finished.
  remaining: function() {
    return this.without.apply( this, this.completed() );
  },

  // We keep the Comments in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function() {
    if ( !this.length ) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Entries are sorted by their original insertion order.
  comparator: function( comment ) {
    return comment.get('order');
  }
});

// Create our global collection of **Entries**.
// alert("js/collections/entries.js - before app.Entries = new EntryList()")
// app.Entries = new EntryList();
// app.Entries = new EntryList( {story_id: 2} );
