class Genre < ApplicationRecord
  has_many :game_genres, dependent: :destroy
  has_many :games, through: :game_genres

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :sorted, -> { order(:name) }
end
