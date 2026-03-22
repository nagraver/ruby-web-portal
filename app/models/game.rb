class Game < ApplicationRecord
  has_many :game_genres, dependent: :destroy
  has_many :genres, through: :game_genres
  has_many :articles, dependent: :nullify
  has_many :reviews, dependent: :destroy

  validates :title, presence: true
  validates :average_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }, allow_nil: true

  scope :recent, -> { order(release_date: :desc) }
  scope :top_rated, -> { order(average_rating: :desc) }
  scope :by_genre, ->(genre_id) { joins(:game_genres).where(game_genres: { genre_id: genre_id }) }

  def recalculate_rating!
    avg = reviews.average(:rating)
    update!(average_rating: avg || 0)
  end
end
