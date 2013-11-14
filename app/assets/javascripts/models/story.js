var app = app || {};

// Story Model
// ----------
// Our basic **Entry** model has `title`, `order`, and `completed` attributes.

app.Story = Backbone.Model.extend({

  // Default attributes ensure that each entry created has `title` and `completed` keys.
  defaults: {
    title: '',
    description: '',
    completed: false
  },

  // Toggle the `completed` state of this entry item.
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }

});
