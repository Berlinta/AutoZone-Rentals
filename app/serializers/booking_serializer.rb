class BookingSerializer < ActiveModel::Serializer
  attributes :id, :description, :car_id, :user_id, :paid, :created_at, :passengers, :car_class

  belongs_to :car
  belongs_to :user
end