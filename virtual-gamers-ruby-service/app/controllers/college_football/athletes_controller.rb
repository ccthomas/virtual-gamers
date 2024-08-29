
module CollegeFootball
  class AthletesController < ApplicationController
    def index
      athletes = AthleteRecord.all
      render json: { count: athletes.size, data: athletes }
    end
  end
end
