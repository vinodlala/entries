class Story < ActiveRecord::Base
  has_many :entries
  # has_one :user
end
