json.array!(@comments) do |comment|
  json.extract! comment, :id, :title, :description, :user_id, :entry_id, :story_id
  json.url comment_url(comment, format: :json)
end
