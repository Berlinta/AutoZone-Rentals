class Booking < ApplicationRecord
  belongs_to :car
  belongs_to :user

  scope :paid?, -> { where(paid: "1") }
  scope :not_paid, -> {where(paid: "0")}

end