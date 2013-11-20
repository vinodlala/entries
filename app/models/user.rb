class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes of your model
  # attr_accessible :id, :name, :description, :email, :password, :created_at, :updated_at, :password_confirmation, :remember_me, :name

  # belongs_to :stories
  # belongs_to :entries

end
