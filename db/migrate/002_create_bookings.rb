class CreateBookings < ActiveRecord::Migration[5.2]
  def change
    create_table :bookings do |t|
      t.integer :car_id
      t.integer :user_id
      t.string :description
      t.integer :paid
      t.integer :passengers
      t.string :car_class
      t.timestamps
    end
  end
end