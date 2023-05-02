# frozen_string_literal: true

# methods for UserEmailMailer

require_relative 'text_style'

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
end
