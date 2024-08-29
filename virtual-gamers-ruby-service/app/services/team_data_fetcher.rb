# app/services/team_data_fetcher.rb

require 'net/http'
require 'json'

class TeamDataFetcher
  API_URL = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams'

  def self.fetch_and_store_teams
    page = 1
    loop do
      response = fetch_data(page)
      teams = parse_teams(response)

      break if teams.empty?

      # TeamRecord.upsert_all(teams, unique_by: { columns: [:id] })
      TeamRecord.upsert_all(teams, unique_by: :id)

      page += 1
    end
  end

  def self.fetch_data(page)
    uri = URI("#{API_URL}?limit=100&page=#{page}")
    response = Net::HTTP.get(uri)
    JSON.parse(response)
  end

  def self.parse_teams(response)
    teams_data = response.dig('sports', 0, 'leagues', 0, 'teams')
    return [] unless teams_data

    teams_data.map do |team_data|
      team = team_data['team']
      {
        id: team['id'],
        uid: team['uid'],
        slug: team['slug'],
        abbreviation: team['abbreviation'],
        display_name: team['displayName'],
        short_display_name: team['shortDisplayName'],
        name: team['name'],
        nickname: team['nickname'],
        location: team['location'],
        color: team['color'],
        alternate_color: team['alternateColor'],
        is_active: team['isActive'],
        is_all_star: team['isAllStar'],
        logos: team['logos'],
        links: team['links']
      }
    end
  end
end
