
module CollegeFootball
  class TeamsController < ApplicationController
    def index
      teams = TeamRecord.all
      render json: { count: teams.size, data: teams }
    end
  end
end
