class TextStyle
  MIN_FONT_SIZE = 12
  MAX_FONT_SIZE = 24
  MAX_WORD_COUNT = 3
  MAX_FONT_SIZE_FOR_MAX_WORD_COUNT = 28

  attr_reader :word_count, :font_size

  def initialize(word_count)
    @word_count = word_count
    @font_size = calculate_font_size
  end

  def max_shift
    # If the font size is equal to the maximum font size for the maximum word count,
    # set the maximum shift to 5.
    # Otherwise, calculate the maximum shift as 28 minus half of the font size (rounded up).
    font_size == MAX_FONT_SIZE_FOR_MAX_WORD_COUNT ? 5 : 28 - (font_size / 2).ceil
  end

  private

  def calculate_font_size
    return MAX_FONT_SIZE_FOR_MAX_WORD_COUNT if word_count >= MAX_WORD_COUNT

    random_factor = rand
    font_size_range = MAX_FONT_SIZE - MIN_FONT_SIZE
    font_size = MIN_FONT_SIZE + (font_size_range * [word_count, MAX_WORD_COUNT - 1].min.to_f / (MAX_WORD_COUNT - 1) * random_factor)
    font_size.round
  end
end
