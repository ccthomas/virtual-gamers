# app/models/team.rb

class TeamRecord < ApplicationRecord
  # Specify the schema and table name if needed
  self.table_name = 'college_football.team'
  self.primary_key = 'id'

  # Validations (adjust as needed)
  validates :id, presence: true, uniqueness: true
  validates :display_name, presence: true
  validates :name, presence: true
  validates :is_active, inclusion: { in: [true, false] }
  validates :is_all_star, inclusion: { in: [true, false] }
end
