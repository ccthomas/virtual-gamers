Rails.application.routes.draw do
  # Other routes
  mount Sidekiq::Web => '/sidekiq'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get "health", to: "health#index", as: :rails_health_check

  namespace :college_football do

    get 'athletes', to: 'athletes#index'

    get 'teams', to: 'teams#index'

    # Management APIs for admins to configure core data.

    post 'management/athletes/load/:team_id', to: 'management/athletes#load'

    post 'management/events/load/:week_num', to: 'management/events#load'

    post 'management/events/summary/load', to: 'management/events#summary_load'
  
    post 'management/teams/load', to: 'management/teams#load'

  end
end


# curl -X POST http://localhost:3032/jobs/hard_job -d "name=bob&count=5" -H "Content-Type: application/x-www-form-urlencoded"
