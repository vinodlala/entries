json.array!(@comments) do |comment|
  # json.extract! comment, :id, :title, :description, :user_id, :entry_id, :story_id, :created_at, :updated_at
  json.extract! comment, :id, :title, :description, :user_id, :entry_id, :story_id

  json.created_at comment.created_at.strftime("%F %l:%M %P")
  json.updated_at comment.updated_at.strftime("%F %l:%M %P")

  if comment.user && comment.user.name
    json.extract! comment.user, :name
  end


  json.url comment_url(comment, format: :json)
end
