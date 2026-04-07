class GameGenre < ApplicationRecord
  belongs_to :game
  belongs_to :genre

  validates :genre_id, uniqueness: { scope: :game_id }
end
