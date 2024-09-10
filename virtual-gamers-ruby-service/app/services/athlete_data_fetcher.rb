require 'net/http'
require 'json'
require 'active_record'
require 'logger'

class AthleteDataFetcher
  API_URL = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/%s/roster'.freeze

  # Initialize a logger for the class
  @logger = Logger.new(STDOUT)
  @logger.level = Logger::DEBUG # Set the desired log level

  def self.fetch_and_store_athletes(team_id)
    url = API_URL % team_id
    @logger.info("Fetching data from URL: #{url}")

    response = fetch_data(url)
    athletes = parse_athletes(response)

    @logger.debug("Fetched athletes: #{athletes.inspect}")

    athletes.each do |athlete|
      @logger.info("Upserting athlete with ID: #{athlete[:id]}")
      begin
        AthleteRecord.upsert(athlete, unique_by: :id)
      rescue StandardError => e
        @logger.error("Failed to upsert athlete with ID: #{athlete[:id]} - #{e.message}")
      end
    end

    @logger.info('Athletes data fetched and stored successfully')
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

  def self.parse_athletes(response)
    @logger.debug("Parsing athletes data: #{response.inspect}")

    unique_athletes = {}

    athletes_data = response.fetch('athletes', [])
    @logger.debug("Number of athlete groups: #{athletes_data.size}")

    athletes_data.each do |athlete_group|
      items = athlete_group.fetch('items', [])
      @logger.debug("Number of items in group: #{items.size}")

      items.each do |athlete_data|
        athlete = athlete_data
        id = athlete.fetch('id', nil)

        if id.nil?
          @logger.warn("Skipping athlete due to missing ID: #{athlete.inspect}")
          next
        end

        @logger.debug("Processing athlete ID: #{id}")

        unique_athletes[id] = {
          id: id,
          uid: athlete.fetch('uid', nil),
          guid: athlete.fetch('guid', nil),
          alternate_ids: athlete.fetch('alternateIds', {}),
          first_name: athlete.fetch('firstName', nil),
          last_name: athlete.fetch('lastName', nil),
          full_name: athlete.fetch('fullName', nil),
          display_name: athlete.fetch('displayName', nil),
          short_name: athlete.fetch('shortName', nil),
          weight: athlete.fetch('weight', nil),
          display_weight: athlete.fetch('displayWeight', nil),
          height: athlete.fetch('height', nil),
          display_height: athlete.fetch('displayHeight', nil),
          links: athlete.fetch('links', []),
          birth_place: athlete.fetch('birthPlace', {}),
          birth_country: athlete.fetch('birthCountry', {}),
          college: athlete.fetch('college', {}),
          slug: athlete.fetch('slug', nil),
          headshot: athlete.fetch('headshot', {}),
          jersey: athlete.fetch('jersey', nil),
          flag: athlete.fetch('flag', {}),
          position: athlete.fetch('position', {}),
          injuries: athlete.fetch('injuries', []),
          teams: athlete.fetch('teams', []),
          experience: athlete.fetch('experience', {}),
          status: athlete.fetch('status', {})
        }
      end
    end

    unique_athletes.values
  end
end
