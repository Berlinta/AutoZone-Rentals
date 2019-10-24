require 'pry'
class BookingsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if params[:user_id]
      @bookings = User.find(params[:user_id]).bookings
    else
      @bookings = Booking.all
    end
  end

  def new
    @booking = Booking.new
  end

  def notpaid
    @bookings = current_user.bookings
  end

  def create
    @user = current_user
    @booking = current_user.bookings.create(booking_params)
     render json: @booking
  end

  def show
    @booking = Booking.find(params[:id])
    @bookings = current_user.bookings
    respond_to do |f|
      f.html {render :show}
      f.json {render json: @booking}
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:description, :paid, :passengers, :car_class, :car_id, user_ids:[])
  end

end