# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Emotion < ApplicationRecord
  has_many :responses, dependent: :destroy

  SHOW_NUMBER_PER_CATEGORY = 12
  enum category: [:negative, :neutral, :positive]
  validates :word, presence: true, length: { in: 2..15 }, uniqueness: { case_sensitive: false }
  validates :category, inclusion: { in: Emotion::categories }
  before_save { self.word&.downcase! }
end
