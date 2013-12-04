json.array!(@collaborators) do |collaborator|
  json.extract! collaborator, :story_id, :user_id
  json.url collaborator_url(collaborator, format: :json)
end
