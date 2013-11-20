class Entry < ActiveRecord::Base
  belongs_to :story
  # has_one :user
end
