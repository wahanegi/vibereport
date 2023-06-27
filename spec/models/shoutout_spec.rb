# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  rich_text      :text             not null
#  type           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_rich_text_and_user_id_and_time_period_id  (rich_text,user_id,time_period_id) UNIQUE
#  index_shoutouts_on_time_period_id                            (time_period_id)
#  index_shoutouts_on_user_id                                   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Shoutout, type: :model do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:shoutout) { build :shoutout }

  describe 'validations' do
    it 'should be valid with valid attributes' do
      expect(shoutout).to be_valid
    end

    it 'should be invalid without rich_text' do
      shoutout.rich_text = nil
      expect(shoutout).to be_invalid
    end

    it 'should be invalid without user' do
      shoutout.user = nil
      expect(shoutout).to be_invalid
    end

    it 'should be invalid without time_period' do
      shoutout.time_period = nil
      expect(shoutout).to be_invalid
    end

    it 'should be invalid with duplicate shoutouts' do
      Shoutout.create(shoutout.as_json)
      shoutout = Shoutout.new(shoutout.as_json)
      expect(shoutout).to be_invalid
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:time_period) }
    it { should have_many(:shoutout_recipients) }
  end

end
