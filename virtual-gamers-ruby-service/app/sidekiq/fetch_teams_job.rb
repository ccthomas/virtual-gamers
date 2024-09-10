class FetchTeamsJob < ApplicationJob
  queue_as :default

  def perform
    TeamDataFetcher.fetch_and_store_teams

    # Fetch all team IDs
    team_ids = TeamRecord.pluck(:id)

    # Enqueue a job to fetch athletes for each team
    team_ids.each do |team_id|
      FetchAthletesJob.perform_later(team_id)
    end
  end
end
