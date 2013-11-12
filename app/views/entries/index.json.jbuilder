json.array!(@entries) do |entry|
  json.extract! entry, :id, :title, :description, :user_id, :story_id
  # json.extract! entry, :title, :description, :user_id, :story_id

  json.url entry_url(entry, format: :json)
end
