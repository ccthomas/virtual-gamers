require 'net/http'
require 'json'
require 'active_record'
require 'logger'

class GameEventDataFetcher
  API_URL = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?week=%s'.freeze

  # Initialize a logger for the class
  @logger = Logger.new(STDOUT)
  @logger.level = Logger::DEBUG # Set the desired log level

  def self.fetch_and_store_events(week_num)
    url = API_URL % week_num
    @logger.info("Fetching data from URL: #{url}")

    response = fetch_data(url)
    events = parse_scoreboard(response)

    @logger.debug("Fetched scoreboard")

    events.each do |event|
      @logger.info("Upserting event with ID: #{event[:id]}")
      begin
        GameEventRecord.upsert(event, unique_by: :id)
      rescue StandardError => e
        @logger.error("Failed to upsert event with ID: #{event[:id]} - #{e.message}")
      end
    end

    @logger.info('Events data fetched and stored successfully')
  end

  private

  def self.fetch_data(url)
    @logger.debug("Fetching data from URL: #{url}")

    uri = URI(url)
    response = Net::HTTP.get(uri)
    JSON.parse(response)
  rescue JSON::ParserError => e
    @logger.error("Failed to parse JSON: #{e.message}")
    {}
  rescue StandardError => e
    @logger.error("Failed to fetch data: #{e.message}")
    {}
  end

  def self.parse_scoreboard(response)
    @logger.debug("Parsing scoreboard data")

    events = []

    scoreboard_data = response.fetch('events', [])
    @logger.debug("Number of events: #{scoreboard_data.size}")

    scoreboard_data.each do |event_data|
      id = event_data.fetch('id', nil)

      if id.nil?
        @logger.warn("Skipping event due to missing ID: #{event_data.inspect}")
        next
      end

      @logger.debug("Processing event ID: #{id}")

      events << {
        id: id,
        year: event_data.dig('season', 'year'),
        week: event_data.dig('week', 'number'),
        date: event_data.fetch('date', nil),
        name: event_data.fetch('name', nil),
        short_name: event_data.fetch('shortName', nil),
        home_id: event_data.dig('competitions', 0, 'competitors', 0, 'team', 'id'),
        away_id: event_data.dig('competitions', 0, 'competitors', 1, 'team', 'id'),
        weather: event_data.dig('weather', 'displayValue'),
        completed: event_data.dig('status', 'type', 'completed')
      }
    end

    events
  end
end
