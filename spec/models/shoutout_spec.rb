# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  digest         :bigint           not null
#  recipients     :string
#  rich_text      :text             not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_digest          (digest) UNIQUE
#  index_shoutouts_on_time_period_id  (time_period_id)
#  index_shoutouts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Shoutout, type: :model do
  let!(:user) { User.create(first_name: 'Fu', last_name: 'Li', email: 'fuli45u6795@example.com', password: 'password') }
  let!(:time_period) { TimePeriod.create(start_date: Time.zone.now, end_date: 7.days.from_now) }

  describe 'validations' do
    it 'should be valid with valid attributes' do
      shoutout = Shoutout.new(rich_text: '@Person 1 @ @Person 2 @Person3 thanks!', user:, time_period:, recipients: [1, 2, 3])
      expect(shoutout).to be_valid
    end

    it 'should be invalid without rich_text' do
      shoutout = Shoutout.new(user:, time_period:, recipients: [1, 2, 3])
      expect(shoutout).to be_invalid
    end

    it 'should be invalid without user' do
      shoutout = Shoutout.new(rich_text: '@Person 1 @ @Person 2 @Person3 thanks!', time_period:, recipients: [1, 2, 3])
      expect(shoutout).to be_invalid
    end

    it 'should be invalid without time_period' do
      shoutout = Shoutout.new(rich_text: '@Person 1 @ @Person 2 @Person3 thanks!', user:, recipients: [1, 2, 3])
      expect(shoutout).to be_invalid
    end

    it 'should be invalid with duplicate shoutouts' do
      digest = 1234567890123456
      Shoutout.create(rich_text: '@Person 1 @ @Person 2 @Person 3 thanks!', user:, time_period:, recipients: [1, 2, 3], digest:)
      shoutout = Shoutout.new(rich_text: '@Person 1 @ @Person 2 @Person 3 thanks!', user:, time_period:, recipients: [1, 2, 3], digest:)
      expect(shoutout).to be_invalid
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:time_period) }
    it { should have_many(:shoutout_recipients) }
  end

end
