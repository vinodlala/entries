json.array!(@stories) do |story|
  # json.extract! story, :id, :title, :description, :user_id
  json.extract! story, :id, :title, :description, :user_id
  json.created_at story.created_at.strftime("%F %l:%M %P")
  json.updated_at story.updated_at.strftime("%F %l:%M %P")
  if story.user && story.user.name
    json.extract! story.user, :name
  end

# look up collaborator stuff here

  # json.collaborators story.users # returns objects

  # json.collaborators story.users.each { |user| user.name } # returns objects
  # json.collaborators story.users.each { |user| :name } # returns objects

  # collaborator_string = "yo"
  # json.collaborators collaborator_string

  # collaborator_string = ""
  # story.users.each { |user| collaborator_string += "hello"}
  # json.collaborators collaborator_string

  collaborator_string = ""
  story.users.each { |user| collaborator_string += ", " + user.name}
  json.collaborators collaborator_string

  collaborator_array = []
  story.users.each { |user| collaborator_array << user.id }
  json.collaborators_ids collaborator_array

  # json.collaborators = []
  # story.users.each_with_index { |user, index|
  #   json.collaborators[index] user.name
  # }


  json.url story_url(story, format: :json)


# look up collaborator stuff here

end
