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
    enum category: [:negative, :neutral, :positive]
    validates :word, presence: true, length: { in: 2..25 }
    validates :category, inclusion: { in: Emotion::categories }
end
