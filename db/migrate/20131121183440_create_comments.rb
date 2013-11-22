class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :title
      t.text :description
      t.integer :user_id
      t.integer :entry_id
      t.integer :story_id

      t.timestamps
    end
    add_index :comments, :user_id
    add_index :comments, :entry_id
    add_index :comments, :story_id
  end
end
