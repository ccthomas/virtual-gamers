module CollegeFootball
  module Management
    class TeamsController < ApplicationController
      def load
        TeamDataFetcher.fetch_and_store_teams
        render json: { message: 'Teams data fetched and stored successfully' }, status: :ok
      end
    end
  end
end
