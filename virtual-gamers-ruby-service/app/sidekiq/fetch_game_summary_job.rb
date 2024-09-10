class FetchGameSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    GameEventSummary.fetch_and_store_summary(event_id)
  end
end
