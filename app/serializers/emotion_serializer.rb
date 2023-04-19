# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class EmotionSerializer
  include JSONAPI::Serializer

  attributes :word, :category

end
