require 'pry'
class UsersController < ApplicationController

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    if !user_params.blank?
      @user = User.create(user_params)

      if @user.valid?
        @user.save
        session[:user_id] = @user.id
        redirect_to user_path(@user)
      else
        render :new
      end

    else
      redirect_to '/signup'
    end
  end

  def show
    if logged_in?
      @user = User.find(params[:id])
    else
      redirect_to 'about'
    end
  end

   private

  def user_params
    params.require(:user).permit(:name, :password, :password_confirmation, :admin, :email)
  end

end