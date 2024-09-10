require 'net/http'
require 'json'
require 'active_record'
require 'logger'

class GameEventSummary
  API_URL = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=%s'.freeze

  # Initialize a logger for the class
  @logger = Logger.new(STDOUT)
  @logger.level = Logger::DEBUG # Set the desired log level

  def self.schedule_summary_updates()
    # Fetch events that need to be processed
    events = GameEventRecord.where('date <= ?', 4.hours.ago).where(is_processed: false)
    events.each do |event|
      FetchGameSummaryJob.perform_later(event.id)
    end
  end

  def self.fetch_and_store_summary(event_id)
    url = API_URL % event_id
    @logger.info("Fetching data from URL: #{url}")

    response = fetch_data(url)
    teams = parse_summary(response)
    @logger.debug("Fetched summary")


    @logger.info teams
  #   events.each do |event|
  #     @logger.info("Upserting event with ID: #{event[:id]}")
  #     begin
  #       GameEventRecord.upsert(event, unique_by: :id)
  #     rescue StandardError => e
  #       @logger.error("Failed to upsert event with ID: #{event[:id]} - #{e.message}")
  #     end
  #   end

    @logger.info('Events data fetched and stored successfully')
  end

  # private

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

  def self.parse_summary(response)
    @logger.debug("Parsing summary data.")
  
    summary_data = response # response.fetch('events', [])
    # @logger.debug("Number of events: #{scoreboard_data.size}")

   
    teams = {}

    # First get points allowed.
    @logger.debug("Grabbing header.")
    header = summary_data.fetch('header', {})
    @logger.debug("Grabbing competitions.")
    competitions = header.fetch('competitions', [])
    @logger.debug("Grabbing competitors.")
    competitors = competitions[0]['competitors']
    @logger.debug("Grabbing team (0).")
    teams[competitors[0]['id']] = {
      id: competitors[0]['id'],
      points_allowed: competitors[1]['score'],
    }
    @logger.debug("Grabbing team (1).")
    teams[competitors[1]['id']] = {
      id: competitors[1]['id'],
      points_allowed: competitors[0]['score'],
    }

    # Next Parse Stats for Athletes & Teams
    team_athletes = {}

    boxscore = summary_data['boxscore']
    players = boxscore['players']
    players.each do |player|
      team_id = player['team']['id']
      statistics = player['statistics']
      statistics.each do [statistic]
        if statistic['name'] == 'passing'
          athletes = statistics['athletes']
          athletes.each do |athlete|
            if team_athletes.key?(athlete['id'])
              team_athletes[athlete['id']].merge!({
                passing_yards: athlete['statistics'][1],
                passing_touchdowns: athlete['statistics'][3],
                interceptions_thrown: athlete['statistics'][4],
              })
            else 
              team_athletes[athlete['id']] = {
                passing_yards:athlete['statistics'][1],
                passing_touchdowns: athlete['statistics'][3],
                interceptions_thrown: athlete['statistics'][4],
              }
            end
          end
        end
      end
    end

    team_athletes
  end
end
