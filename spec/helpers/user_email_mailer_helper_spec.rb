# frozen_string_literal: true

require 'rails_helper'

describe UserEmailMailerHelper, type: :helper do
  describe '#btn_special' do
    it 'should be exists method' do
      expect { helper.btn_special('', '') }.to_not raise_error
    end
    it 'should be 127 when :width attribute & length of the word is no more 11 characters' do
      word = 'a' * 11
      word_little = 'a' * 2
      expect(helper.btn_special(word, :width)).to eq(127)
      expect(helper.btn_special(word_little, :width)).to eq(127)
    end
    it 'should be 132 when :width attribute & length of the word is 12 characters' do
      word = 'a' * 12
      expect(helper.btn_special(word, :width)).to eq(132)
    end
    it 'should be 25 when :margin attribute & length of the word is no more 11 characters' do
      word = 'a' * 11
      expect(helper.btn_special(word, :margin)).to eq(25)
    end
    it 'should be 22.5 when :margin attribute & length of the word is 12 characters' do
      word = 'a' * 12
      expect(helper.btn_special(word, :margin)).to eq(22.5)
    end
    it 'padding is wrong attribute' do
      word = ''
      expect(helper.btn_special(word, :padding)).to eq('wrong attribute')
    end
  end

  describe '#emotions_table' do
    it 'returns a flattened table of emotions' do

      positive_emotions = create_list(:emotion, NUMBER_OF_ELEMENTS, :positive)
      negative_emotions = create_list(:emotion, NUMBER_OF_ELEMENTS, :negative)
      emotions = positive_emotions + negative_emotions

      result = emotions_table

      expect(result).to be_an(Array)
      expect(result.size).to eq(NUMBER_OF_ELEMENTS * 2)
    end
  end

  describe '#who_is_waiting' do
    let(:user) { create :user }
    let(:user2) { create :user }
    let(:time_period) { create(:time_period) }

    it 'returns message when the user is a manager' do
      user_team = create(:user_team, user:, role: :manager)
      user_team2 = create(:user_team, user: user2, role: :observer)
      team = user_team.team
      user_team2.team
      result = who_is_waiting(user, time_period)
      expect(result).to eq("The #{team.name} team is waiting for you to check-in for #{time_period.date_range_str}")
    end

    it 'returns nil when the user is not a manager' do
      create(:user_team, user:, role: :observer)
      result = who_is_waiting(user, time_period)
      expect(result).to eq(nil)
    end
  end
end
