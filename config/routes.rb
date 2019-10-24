Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static#about'

  get '/auth/facebook/callback' => 'sessions#create'

  get '/signup', to: 'users#new'
    get '/signin', to: 'sessions#new'
    get '/sessions/destroy' => 'sessions#destroy'
    post '/signin' => 'sessions#create'

    get '/bookings/notpaid' => 'bookings#notpaid'
    get 'current_user' => "users#current_user"

  resources :users
  resources :bookings
  resources :cars

  resources :users do
    resources :bookings, only: [:show, :index, :new]
  end

  resources :cars do
    resources :bookings
  end

end
