class FetchAthletesJob < ApplicationJob
  queue_as :default

  # Define a constant to control the delay between API calls
  API_THROTTLE_DELAY = 1 # seconds

  def perform(team_id)
    # Fetch and store athletes for the given team ID
    AthleteDataFetcher.fetch_and_store_athletes(team_id)
    
    # Throttle the API calls to avoid overloading
    sleep(API_THROTTLE_DELAY)
  end
end
