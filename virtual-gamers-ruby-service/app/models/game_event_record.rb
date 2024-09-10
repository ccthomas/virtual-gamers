class GameEventRecord < ApplicationRecord
  # Specify the schema and table name if needed
  self.table_name = 'college_football.event'
  self.primary_key = 'id'

  # Validations (adjust as needed)
  validates :id, presence: true, uniqueness: true

  # Add pagination support
  paginates_per 10
end
