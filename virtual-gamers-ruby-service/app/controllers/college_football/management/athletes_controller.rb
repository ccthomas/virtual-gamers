module CollegeFootball
  module Management
    class AthletesController < ApplicationController
      def load
        # Retrieve team_id from URL parameters
        team_id = params[:team_id]

        # Fetch and store athletes using the provided team_id
        if team_id.present?
          AthleteDataFetcher.fetch_and_store_athletes(team_id)
          render json: { message: 'Athletes data fetched and stored successfully' }, status: :ok
        else
          render json: { error: 'Team ID is required' }, status: :bad_request
        end
      end
    end
  end
end
