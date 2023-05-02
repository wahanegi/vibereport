require 'rails_helper'

RSpec.describe TextStyle do
  describe '#initialize' do
    it 'initializes a TextStyle' do
      text_style = TextStyle.new(2)
      expect(text_style.word_count).to eq(2)
      expect(text_style.font_size).to be_between(TextStyle::MIN_FONT_SIZE, TextStyle::MAX_FONT_SIZE_FOR_MAX_WORD_COUNT)
    end
  end

  describe '#max_shift' do
    context 'when font_size is equal to MAX_FONT_SIZE_FOR_MAX_WORD_COUNT' do
      it 'returns 5' do
        text_style = TextStyle.new(TextStyle::MAX_WORD_COUNT)
        expect(text_style.max_shift).to eq(5)
      end
    end

    context 'when font_size is not equal to MAX_FONT_SIZE_FOR_MAX_WORD_COUNT' do
      it 'returns 28 minus half of the font_size' do
        text_style = TextStyle.new(1)
        expected_max_shift = 28 - (text_style.font_size / 2).ceil
        expect(text_style.max_shift).to eq(expected_max_shift)
      end
    end
  end

  describe '#calculate_font_size' do
    it 'returns MAX_FONT_SIZE_FOR_MAX_WORD_COUNT if word_count >= MAX_WORD_COUNT' do
      text_style = TextStyle.new(TextStyle::MAX_WORD_COUNT)
      expect(text_style.font_size).to eq(TextStyle::MAX_FONT_SIZE_FOR_MAX_WORD_COUNT)
    end

    it 'returns a font size between MIN_FONT_SIZE and MAX_FONT_SIZE if word_count < MAX_WORD_COUNT' do
      text_style = TextStyle.new(1)
      expect(text_style.font_size).to be_between(TextStyle::MIN_FONT_SIZE, TextStyle::MAX_FONT_SIZE)
    end
  end
end