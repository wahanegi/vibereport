# frozen_string_literal: true

# methods for UserEmailMailer

NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

module UserEmailMailerHelper
  def btn_special(word, attr)
    case attr
    when :width
      word.length > 11 ? word.length * 11 : 127
    when :margin
      word.length > 11 ? (25 - (((word.length * 11) - 127) / 2.0)) : 25
    else
      'wrong attribute'
    end
  end

  def emotions_table
    table = []
    emotions = Emotion.emotion_public.positive.sample(NUMBER_OF_ELEMENTS) +
               Emotion.emotion_public.negative.sample(NUMBER_OF_ELEMENTS)
    emotions.each_slice(6) { |sliced_emotions| table << sliced_emotions }
    table = table.transpose.flatten
  end
end
