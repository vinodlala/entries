class Entry < ActiveRecord::Base
  belongs_to :story
  has_many :comments
  # has_one :user
end
