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
    max_word_count = 3 # You can adjust this value based on the desired scaling
    max_font_size_for_max_word_count = 32
    
    # Calculate the font size based on word_count
    if word_count >= max_word_count
      font_size = max_font_size_for_max_word_count
    else
      font_size = min_font_size + ((max_font_size - min_font_size) * [word_count, max_word_count - 1].min.to_f / (max_word_count - 1))
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

    if font_size == 32
      max_shift = 15 - (font_size / 2).ceil
    else
      max_shift = 28 - (font_size / 2).ceil
    end

    left_shift = rand(-max_shift..max_shift)
    top_shift = rand(-max_shift..max_shift)
    padding_top = rand(-2..18)
    padding_right = rand(-2..21)
    padding_bottom = rand(-2..18)
    padding_left = rand(-2..21)
  
    "position: relative; color: #{color}; font-size: #{font_size}px; font-family: #{font_family}; left: #{left_shift}px; top: #{top_shift}px; "
  end
end
