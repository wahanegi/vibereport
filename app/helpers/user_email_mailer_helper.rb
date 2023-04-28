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

  def random_position_and_style(category, word_count)
    case category
    when "positive"
      color = "#4F9B64"
    when "neutral"
      color = "#4C77CB"
    when "negative"
      color = "#D1794E"
    end
    
    min_font_size = 12
    max_font_size = 24
    max_word_count = 3 # will be can adjust this value based on the desired number of repetitions of the word by the User
    max_font_size_for_max_word_count = 28
    
    if word_count >= max_word_count
      font_size = max_font_size_for_max_word_count
    else
      random_factor = rand()
      font_size_range = max_font_size - min_font_size
      font_size = min_font_size + (font_size_range * [word_count, max_word_count - 1].min.to_f / (max_word_count - 1) * random_factor)
      font_size = font_size.round
    end
    
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

    if font_size == max_font_size_for_max_word_count
      max_shift = 5
    else
      max_shift = 28 - (font_size / 2).ceil
    end

    left_shift = rand(-max_shift..max_shift)
    top_shift = rand(-max_shift..max_shift)
  
    "position: relative; color: #{color}; font-size: #{font_size}px; font-family: #{font_family}; left: #{left_shift}px; top: #{top_shift}px;"
  end
end
