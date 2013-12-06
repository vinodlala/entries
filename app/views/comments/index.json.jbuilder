json.array!(@comments) do |comment|

  # add id of comment
  # json.extract! comment, :id, :title, :description, :user_id, :entry_id, :story_id, :created_at, :updated_at

  # format created/updated dates/times
  json.extract! comment, :id, :title, :description, :user_id, :entry_id, :story_id
  json.created_at comment.created_at.strftime("%F %l:%M %P")
  json.updated_at comment.updated_at.strftime("%F %l:%M %P")

  # get name of user who wrote comment
  if comment.user && comment.user.name
    json.extract! comment.user, :name
  end

  # I hope that commenting this line prevents the double comment for new comments
  json.url comment_url(comment, format: :json)
end
