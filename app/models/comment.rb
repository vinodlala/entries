class Comment < ActiveRecord::Base
  belongs_to :entry
  belongs_to :story
  belongs_to :user
end
