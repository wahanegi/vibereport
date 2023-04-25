# frozen_string_literal: true

# methods for UserEmailMailer
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

  def random_position_and_style(category)
    case category
    when "positive"
      color = "#4F9B64"
    when "neutral"
      color = "#4C77CB"
    when "negative"
      color = "#D1794E"
    end
    font_size_percentage = rand(10..40)
    font_size = 12 + (12 * (font_size_percentage - 10) / 30.0)
    font_families = [
      "Arial",
      "Helvetica",
      "sans-serif",
      "Times New Roman",
      "Times",
      "serif",
      "Georgia",
      "Palatino",
      "Garamond",
      "Bookman",
      "Comic Sans MS",
      "Trebuchet MS",
      "Arial Black",
      "Impact"
    ]
    font_family = font_families.sample
    max_shift = 30 - (font_size / 2).ceil
    left_shift = rand(-max_shift..max_shift)
    top_shift = rand(-max_shift..max_shift)
    padding_top = rand(12..18)
    padding_right = rand(12..21)
    padding_bottom = rand(12..18)
    padding_left = rand(12..21)
  
    "position: relative; color: #{color}; font-size: #{font_size}px; font-family: #{font_family}; left: #{left_shift}px; top: #{top_shift}px; "
  end
end
