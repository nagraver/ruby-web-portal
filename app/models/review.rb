class Review < ApplicationRecord
  belongs_to :user
  belongs_to :game
  has_many :comments, as: :commentable, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true
  validates :rating, presence: true, numericality: { only_integer: true, in: 1..10 }
  validates :user_id, uniqueness: { scope: :game_id, message: "уже оставил отзыв на эту игру" }

  scope :recent, -> { order(created_at: :desc) }

  after_save :update_game_rating
  after_destroy :update_game_rating

  private

  def update_game_rating
    game.recalculate_rating!
  end
end
