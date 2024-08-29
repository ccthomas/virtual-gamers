Rails.application.routes.draw do
  # Other routes
  mount Sidekiq::Web => '/sidekiq'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "health", to: "health#index", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # 
  namespace :college_football do
    # New endpoint to get all athletes
    get 'athletes', to: 'athletes#index'
  
    # New endpoint to get all teams
    get 'teams', to: 'teams#index'
    
    # Moved load endpoint under college_football namespace
    get 'management/teams/load', to: 'management/teams#load'

    get 'management/athletes/load/:team_id', to: 'management/athletes#load'
  end
  # Define the route for triggering the HardJob
  post 'jobs/hard_job', to: 'jobs#create'
  post 'jobs/load', to: 'jobs#load'

end


# curl -X POST http://localhost:3032/jobs/hard_job -d "name=bob&count=5" -H "Content-Type: application/x-www-form-urlencoded"
