class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title
      t.text :description
      t.integer :user_id
      t.integer :story_id

      t.timestamps
    end
    add_index :entries, :user_id
    add_index :entries, :story_id
  end
end
