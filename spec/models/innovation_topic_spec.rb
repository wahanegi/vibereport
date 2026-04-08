# == Schema Information
#
# Table name: innovation_topics
#
#  id              :bigint           not null, primary key
#  innovation_body :text             not null
#  posted          :boolean          default(FALSE), not null
#  sort_order      :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  time_period_id  :bigint
#  user_id         :bigint           not null
#
# Indexes
#
#  index_innovation_topics_on_time_period_id  (time_period_id)
#  index_innovation_topics_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe InnovationTopic, type: :model do
  let(:user) { create :user }
  let(:time_period) { create :time_period }
  let(:topic) { build(:innovation_topic, user: user, time_period: time_period) }

  describe 'associations' do
    it { should belong_to(:time_period).optional }
    it { should have_one(:response).dependent(:nullify) }
    it { should have_many(:innovation_brainstormings).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:innovation_body) }
    it { should validate_numericality_of(:sort_order).is_greater_than(0).only_integer }

    describe 'uniqueness of innovation_body' do
      subject { create(:innovation_topic) }

      it { is_expected.to validate_uniqueness_of(:innovation_body).case_insensitive }
    end

    describe 'uniqueness of sort_order' do
      subject { create(:innovation_topic) }

      it { is_expected.to validate_uniqueness_of(:sort_order) }
    end
  end

  describe 'sort order assignment' do
    let!(:last_topic) { create(:innovation_topic, sort_order: 520) }

    it 'assigns next sort_order when value is not provided' do
      new_topic = create(:innovation_topic, sort_order: nil)

      expect(new_topic.sort_order).to eq(last_topic.sort_order + 10)
    end

    it 'does not allow zero sort_order' do
      topic_with_zero_sort_order = build(:innovation_topic, sort_order: 0)

      expect(topic_with_zero_sort_order).not_to be_valid
      expect(topic_with_zero_sort_order.errors[:sort_order]).to include('must be greater than 0')
    end

    it 'does not allow nil sort_order on update' do
      existing_topic = create(:innovation_topic, sort_order: 530)

      expect(existing_topic.update(sort_order: nil)).to eq(false)
      expect(existing_topic.errors[:sort_order]).to include("can't be blank")
    end
  end

  describe 'Ransack support' do
    it 'returns the expected attributes' do
      expect(described_class.ransackable_attributes).to match_array(%w[id innovation_body posted sort_order time_period_id created_at updated_at user_id])
    end

    it 'returns the expected associations' do
      expect(described_class.ransackable_associations).to match_array(%w[innovation_brainstormings response time_period user])
    end
  end

  describe 'factory' do
    it 'should be valid' do
      expect(topic).to be_valid
    end
  end
end
