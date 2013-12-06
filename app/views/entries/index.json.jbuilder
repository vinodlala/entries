json.array!(@entries) do |entry|
  # json.extract! entry, :title, :description, :user_id, :story_id

  # add id of entry
  # json.extract! entry, :id, :title, :description, :user_id, :story_id, :created_at, :updated_at

  # format created/updated dates/times
  json.extract! entry, :id, :title, :description, :user_id, :story_id
  json.created_at entry.created_at.strftime("%F %l:%M %P")
  json.updated_at entry.updated_at.strftime("%F %l:%M %P")

  # get name of user who wrote entry
  if entry.user && entry.user.name
    json.extract! entry.user, :name
  end

  # following line was preventing entries from showing
  # json.url entry_url(entry, format: :json)
end
