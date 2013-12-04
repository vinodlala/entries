class Story < ActiveRecord::Base
  has_many :entries
  has_many :comments, :through => :entry
  belongs_to :user

  has_many :collaborators
  has_many :users, :through => :collaborators
end

