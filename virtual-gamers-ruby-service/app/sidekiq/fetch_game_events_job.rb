class FetchGameEventsJob < ApplicationJob
  queue_as :default

  def perform(week_num)
    GameEventDataFetcher.fetch_and_store_events(week_num)
  end
end
