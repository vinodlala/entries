class StoriesController < ApplicationController
  before_action :set_story, only: [:show, :edit, :update, :destroy]

  # GET /stories
  # GET /stories.json
  def index
    # returns user information along with story
    # @stories = Story.includes(:user).all


    # @stories = Story.includes([:user, {:collaborator => :user}]).all
    @stories = Story.includes( [ :user, :users ]).all

  end

  # GET /stories/1
  # GET /stories/1.json
  def show
  end

  # GET /stories/new
  def new
    @story = Story.new
    @user = User.all
  end

  # GET /stories/1/edit
  def edit
  end

  # POST /stories
  # POST /stories.json
  def create
    @story = Story.new(story_params)
    @story.user_id = current_user.id

    respond_to do |format|
      if @story.save
        format.html { redirect_to @story, notice: 'Story was successfully created.' }
        format.json { render action: 'show', status: :created, location: @story }
      else
        format.html { render action: 'new' }
        format.json { render json: @story.errors, status: :unprocessable_entity }
      end
    end


# adding collaborators vin 12/3
# works for one collaborator
    @collaborator_id = params[:collaborator_id]
    Collaborator.create(:story_id => @story.id, :user_id => @collaborator_id)

# trying multiple collaborators
    @collaborator_ids = params[:collaborator_ids]

    if @collaborator_ids.kind_of?(Array)
      @collaborator_ids.each { |collaborator_id |
        Collaborator.create(:story_id => @story.id, :user_id => collaborator_id)
      }
    end



    # redirect "/"



  end

  # PATCH/PUT /stories/1
  # PATCH/PUT /stories/1.json
  def update
    respond_to do |format|
      if @story.update(story_params)
        format.html { redirect_to @story, notice: 'Story was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @story.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stories/1
  # DELETE /stories/1.json
  def destroy
    @story.destroy
    respond_to do |format|
      format.html { redirect_to stories_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_story
      @story = Story.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def story_params
      params.require(:story).permit(:title, :description, :user_id)
    end
end
