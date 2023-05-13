# == Schema Information
#
# Table name: shoutout_recipients
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shoutout_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_shoutout_recipients_on_shoutout_id  (shoutout_id)
#  index_shoutout_recipients_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ShoutoutRecipient, type: :model do
  let!(:shoutout) { create(:shoutout) }
  let!(:user) { create(:user) }

  describe 'associations' do
    it { should belong_to(:shoutout) }
    it { should belong_to(:user) }
  end

  describe 'factory' do
    it 'should be valid' do
      shoutout_recipient = create(:shoutout_recipient, shoutout: shoutout, user: user)
      expect(shoutout_recipient).to be_valid
    end
  end
end
