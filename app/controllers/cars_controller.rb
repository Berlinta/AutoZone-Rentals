class CarsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @cars = Car.all
    @car = Car.new
    respond_to do |f|
      f.html {render :index}
      f.json {render json: @cars}
    end
  end

  def show
    @car = Car.find(params[:id])
    respond_to do |f|
      f.html {render :show}
      f.json {render json: @car}
    end
  end


   def create
     @car = Car.new(car_params)
     if @car.save
       render json: @car
     else
       redirect_to root_path
     end
   end

   def edit
    @car = Car.find_by(id: params[:id])
  end

  def update
    @car = Car.find_by(id: params[:id])
    @car.update(car_params)
      redirect_to car_path(@car)
  end

   private

   def car_params
     params.require(:car).permit(:name, :location, :booking, user_ids:[])
   end

end