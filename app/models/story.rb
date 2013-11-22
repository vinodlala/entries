class Story < ActiveRecord::Base
  has_many :entries
  has_many :comments, :through => :entry

  # has_one :user
end
