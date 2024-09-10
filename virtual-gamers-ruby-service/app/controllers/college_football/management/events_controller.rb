module CollegeFootball
  module Management
    class EventsController < ApplicationController
      def load
        # Retrieve week_num from URL parameters
        week_num = params[:week_num]

        # Fetch and store athletes using the provided team_id
        if week_num.present?
          FetchGameEventsJob.perform_later(week_num)
          render json: { message: 'Game event data fetched and stored successfully' }, status: :ok
        else
          render json: { error: 'Week num is required' }, status: :bad_request
        end
      end

      def summary_load
        event_id = params[:event_id]

        if event_id.present?
          GameEventSummary.fetch_and_store_summary(event_id)
          render json: { message: 'Game Summary load event data successfully for event id provided' }, status: :ok
        else
          GameEventSummary.schedule_summary_updates
          render json: { message: 'Game Summary load event data successfully' }, status: :ok
        end
      end
    end
  end
end
