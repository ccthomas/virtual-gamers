# app/models/team.rb

class AthleteRecord < ApplicationRecord
  # Specify the schema and table name if needed
  self.table_name = 'college_football.athlete'
  self.primary_key = 'id'

  # Validations (adjust as needed)
  validates :id, presence: true, uniqueness: true
end
