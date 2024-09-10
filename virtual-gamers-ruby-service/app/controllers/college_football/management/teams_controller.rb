module CollegeFootball
  module Management
    class TeamsController < ApplicationController
      def load
        FetchTeamsJob.perform_later
        render json: { message: 'Teams data fetching job scheduled.' }, status: :ok
      end
    end
  end
end
