# frozen_string_literal: true

# methods for UserEmailMailer

require_relative 'text_style'
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

  def random_position_and_style(category, word_count)
    colors = {
      'positive' => '#4F9B64',
      'neutral' => '#4C77CB',
      'negative' => '#D1794E'
    }

    color = colors[category]
    text_style = TextStyle.new(word_count)
    font_size = text_style.font_size

    font_families = [
      'Josefin Sans', 'Arial'
    ]
    font_family = font_families.sample

    max_shift = text_style.max_shift

    left_shift = rand(-max_shift..max_shift)
    top_shift = rand(-max_shift..max_shift)

    "position: relative; color: #{color}; font-size: #{font_size}px; font-family: #{font_family}; left: #{left_shift}px; top: #{top_shift}px;"
  end

  def emotions_table
    table = []
    emotions = Emotion.emotion_public.positive.sample(NUMBER_OF_ELEMENTS) +
               Emotion.emotion_public.negative.sample(NUMBER_OF_ELEMENTS)
    emotions.each_slice(6) { |sliced_emotions| table << sliced_emotions }
    table = table.transpose.flatten
  end
end
