class EmotionSerializer
  include JSONAPI::Serializer

  attributes :word, :category

end
