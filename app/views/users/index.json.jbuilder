json.array!(@users) do |user|
  json.extract! user, :id, :name, :description, :email, :password
  json.url user_url(user, format: :json)
end
