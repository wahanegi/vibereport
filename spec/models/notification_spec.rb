# == Schema Information
#
# Table name: notifications
#
#  id         :bigint           not null, primary key
#  details    :text
#  viewed     :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Notification, type: :model do
  let!(:notification) { create :notification }
  let!(:viewed_notification) { create :notification, viewed: true }

  describe 'factory' do
    it 'should be valid' do
      notification = FactoryBot.build(:notification)
      expect(notification).to be_valid
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:details) }
  end

  describe 'scopes' do
    describe '.not_viewed' do
      it 'returns not viewed by Admin notifications' do
        expect(Notification.not_viewed.to_a).to eq([notification])
      end
    end
  end
end
