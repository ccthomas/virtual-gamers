# app/controllers/health_controller.rb
class HealthController < ApplicationController
  include JwtAuthenticable

  # GET /up
  def index
    begin
      # Fetch PostgreSQL server version
      result = ActiveRecord::Base.connection.execute('SHOW server_version')
      version = result.first['server_version']

      # Render the PostgreSQL status as "Healthy"
      render json: { Service: "Healthy", PostgresSql: version }, status: :ok
    rescue => e
      # Render PostgreSQL status as "Unhealthy" in case of error
      render json: { Service: "Unhealthy", PostgresSql: "Unhealthy", error: e.message }, status: :ok
    end
  end
end
