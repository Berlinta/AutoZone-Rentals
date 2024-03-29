class SessionsController < ApplicationController

  def new
    @user = User.new
    @users = User.all
  end

  def create
    if auth = request.env["omniauth.auth"]
      @user = User.find_or_create_by_omniauth(auth)
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      user = User.find_by(:email => params[:user][:email])
      if user && user.authenticate(params[:user][:password])
        session[:user_id] = user.id
        redirect_to user_path(user)
      else
        render 'sessions/new'
      end
    end
  end


  def destroy
    reset_session
    redirect_to root_path
  end

  private

    def auth
      request.env['omniauth.auth']
    end

end