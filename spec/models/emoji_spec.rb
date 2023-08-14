# == Schema Information
#
# Table name: emojis
#
#  id             :bigint           not null, primary key
#  emoji_code     :string
#  emoji_name     :string
#  emojiable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  emojiable_id   :bigint
#  user_id        :bigint
#
# Indexes
#
#  index_emojis_on_emojiable  (emojiable_type,emojiable_id)
#  index_emojis_on_user_id    (user_id)
#

require 'rails_helper'

RSpec.describe Emoji, type: :model do
  let!(:fun_question) { create :fun_question }
  let!(:user) { create :user }
  let!(:fun_question_answer) { create :fun_question_answer }

  describe 'validations' do
    it { should validate_presence_of(:emoji_code) }
    it 'should be invalid with duplicated emoji' do
      FactoryBot.create(:emoji, emoji_code: ':open_mouth:', user_id: user.id, emojiable: fun_question_answer)
      new_emoji = FactoryBot.build(:emoji, emoji_code: ':open_mouth:', user_id: user.id, emojiable: fun_question_answer)
      expect(new_emoji).to be_invalid
    end
  end

  describe 'associations' do
    it { should belong_to(:emojiable) }
  end

  describe 'scopes' do
    describe '.ordered' do
      it 'orders emojis by created_at in descending order' do
        emoji1 = FactoryBot.create(:emoji, created_at: 2.days.ago, user_id: user.id, emojiable: fun_question_answer)
        emoji2 = FactoryBot.create(:emoji, created_at: 1.day.ago, user_id: user.id, emojiable: fun_question_answer)
        emoji3 = FactoryBot.create(:emoji, created_at: Date.current, user_id: user.id, emojiable: fun_question_answer)

        expect(Emoji.ordered).to eq([emoji3, emoji2, emoji1])
      end
    end
  end
end
