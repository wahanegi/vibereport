# == Schema Information
#
# Table name: innovation_brainstormings
#
#  id                  :bigint           not null, primary key
#  brainstorming_body  :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  innovation_topic_id :bigint           not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_innovation_brainstormings_on_innovation_topic_id  (innovation_topic_id)
#  index_innovation_brainstormings_on_user_id              (user_id)
#  index_unique_brainstorm_on_user_and_topic               (user_id,innovation_topic_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (innovation_topic_id => innovation_topics.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe InnovationBrainstorming, type: :model do
  let(:user) { create(:user) }
  let(:topic) { create(:innovation_topic, user: user) }
  let(:brainstorming) { build(:innovation_brainstorming, user: user, innovation_topic: topic) }

  describe 'association' do
    it { should belong_to(:user) }
    it { should belong_to(:innovation_topic) }
    it { should have_one(:response).dependent(:nullify) }
  end

  describe 'validations' do
    it { should validate_presence_of(:brainstorming_body) }

    it 'validates uniqueness of user_id scoped to innovation_topic_id' do
      brainstorming.save
      duplicate = build(:innovation_brainstorming, innovation_topic: topic, user: user)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:user_id]).to include('can submit only one brainstorming per topic')
    end
  end

  describe 'Ransack support' do
    it 'returns the expected attributes' do
      expect(described_class.ransackable_attributes).to match_array(%w[id brainstorming_body innovation_topic_id user_id created_at updated_at deleted_at])
    end

    it 'returns the expected associations' do
      expect(described_class.ransackable_associations).to match_array(%w[innovation_topic user response])
    end
  end

  describe 'factory' do
    it 'should be valid' do
      expect(brainstorming).to be_valid
    end
  end
end
