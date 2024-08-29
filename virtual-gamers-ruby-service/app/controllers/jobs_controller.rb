# app/controllers/jobs_controller.rb
class JobsController < ApplicationController
  # POST /jobs/hard_job
  def create
    name = params[:name]
    count = params[:count].to_i
    
    if name.present? && count > 0
      HardJob.perform_async(name, count)
      render json: { message: 'Job enqueued successfully' }, status: :accepted
    else
      render json: { error: 'Invalid parameters' }, status: :unprocessable_entity
    end
  end

  # POST /jobs/load
  def load
    FetchTeamsJob.perform_later
    render json: { message: 'Job enqueued successfully' }, status: :accepted
  end
end
