class User < ApplicationRecord
  has_secure_password
  has_many :bookings
  has_many :cars, through: :bookings

  validates :email, :presence => true
  validates :email, :uniqueness => true


  def self.find_or_create_by_omniauth(auth)
    self.where(:email => auth["info"]["email"]).first_or_create do |user|
      user.password = SecureRandom.hex
    end
  end
end