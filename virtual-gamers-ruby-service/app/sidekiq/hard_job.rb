# app/jobs/hard_job.rb
class HardJob
  include Sidekiq::Job

  # Define the perform method to execute the job logic
  def perform(name, count)
    Rails.logger.info "Starting HardJob with name=#{name} and count=#{count}"

    # Example of a time-consuming task, e.g., calling an external API or processing data
    result = some_time_consuming_task(name, count)

    Rails.logger.info "Completed HardJob with result=#{result}"
  end

  private

  def some_time_consuming_task(name, count)
    # Simulate a task that takes time, e.g., API call or data processing
    sleep 5 # Simulates a delay
    "Processed #{count} items for #{name}"
  end
end
