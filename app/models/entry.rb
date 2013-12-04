class Entry < ActiveRecord::Base
  belongs_to :story
  has_many :comments
  belongs_to :user
end
