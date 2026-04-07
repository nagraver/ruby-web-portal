class Article < ApplicationRecord
  belongs_to :user
  belongs_to :game, optional: true
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :likes, as: :likeable, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true

  scope :published, -> { where.not(published_at: nil).where("published_at <= ?", Time.current) }
  scope :recent, -> { order(published_at: :desc) }
  scope :drafts, -> { where(published_at: nil) }

  def published?
    published_at.present? && published_at <= Time.current
  end

  def liked_by?(user)
    return false unless user
    likes.exists?(user: user)
  end
end
