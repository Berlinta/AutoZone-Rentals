class CarSerializer < ActiveModel::Serializer
  attributes :id, :name, :location, :bookings, :user_ids

  has_many :bookings
  has_many :users, through: :bookings
end
