class CreateGames < ActiveRecord::Migration[7.2]
  def change
    create_table :games do |t|
      t.string :title, null: false
      t.text :description
      t.string :developer
      t.string :publisher
      t.date :release_date
      t.string :cover_image
      t.decimal :average_rating, precision: 3, scale: 1, default: 0.0

      t.timestamps
    end

    add_index :games, :title
  end
end
