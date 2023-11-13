# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("positive")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Emotion < ApplicationRecord
  has_many :responses, dependent: :destroy

  SHOW_NUMBER_PER_CATEGORY = 12
  enum category: { negative: 0, positive: 1 }
  scope :emotion_public, -> { where(public: true) }
  validates :word, presence: true, length: { in: 2..15 }, uniqueness: { scope: :category, case_sensitive: false }
  validates :category, inclusion: { in: Emotion::categories }
  before_save { self.word&.downcase! }

  scope :matching_emotions, ->(emotion_params) { where(word: emotion_params[:word], category: emotion_params[:category]) }

  def self.ransackable_attributes(_auth_object = nil)
    %w[category public word]
  end
end
