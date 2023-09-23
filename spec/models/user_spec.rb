# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  not_ask_visibility     :boolean          default(FALSE), not null
#  opt_out                :boolean          default(FALSE)
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  let!(:user) { create :user, opt_out: false }
  let!(:user2) { create :user, opt_out: false }
  let!(:opted_out_user) { create :user, opt_out: true }

  it 'factory works' do
    expect(user).to be_valid
  end

  context 'Associations' do
    it 'has many responses' do
      expect(user).to have_many(:responses).dependent(:destroy)
    end

    it 'has many user_teams' do
      expect(user).to have_many(:user_teams)
    end
  
    it 'has many teams through user_teams' do
      expect(user).to have_many(:teams).through(:user_teams)
    end
  end

  context 'Validations' do
    subject { FactoryBot.build(:user) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }

    context 'when password is required' do
      before do
        allow(user).to receive(:password_required?).and_return(true)
      end
    
      it 'validates presence of password' do
        user.password = nil
        expect(user).to be_invalid
        expect(user.errors[:password]).to include("can't be blank")
      end
    end
    
    context 'when password is not required' do
      before do
        allow(user).to receive(:password_required?).and_return(false)
      end
    
      it 'does not validate presence of password' do
        user.password = nil
        expect(user).to be_valid
      end
    end
  
    it 'password passes more then 6 characters' do
      user.password = Faker::Internet.password(min_length: 6, max_length: 128)
      expect(user.valid?).to be_truthy
    end
    
    it 'is valid email' do
      expect(user.valid?).to be_truthy
    end
    it 'is not valid email' do
      user.email = 'qwerty'
      expect(user.valid?).to be_falsey
    end
    it 'is invalid if the email is not unique' do
      expect(FactoryBot.build(:user, email: user.email)).to_not be_valid
    end
    it 'first_name fails with more then 15 characters' do
      user.first_name = Faker::Internet.name[16..40]
      expect(user).to_not be_valid
    end
    it 'last_name fails with more then 15 characters' do
      user.last_name = Faker::Internet.name[16..40]
      expect(user).to_not be_valid
    end
    it 'first_name passes for characters from 1 to 15' do
      user.first_name = Faker::Internet.name[1..15]
      expect(user).to be_valid
    end
    it 'last_name passes for characters from 1 to 15' do
      user.last_name = Faker::Internet.name[1..15]
      expect(user).to be_valid
    end
  end

  context 'Scopes' do
    it '.opt_in' do
      expect(User.opt_in).to match_array([user, user2])
    end
    it 'opt_in users not include opted_out_user' do
      expect(User.opt_in).to_not include(opted_out_user)
    end
  end

  describe '.ordered' do
    it 'orders users by first name in ascending order' do
      User.destroy_all
      alica = FactoryBot.create(:user, first_name: 'Alica')
      bob = FactoryBot.create(:user, first_name: 'Bob')
      robert = FactoryBot.create(:user, first_name: 'Robert')
      expect(User.ordered).to match_array [alica, bob, robert]
    end
  end

  context 'Callbacks' do
    describe '#strip_first_name_last_name' do
      let(:user) { build(:user, first_name: " John ", last_name: " Doe ") }

      it 'strips leading and trailing whitespace from first_name before validation' do
        user.validate
        expect(user.first_name).to eq('John')
      end

      it 'strips leading and trailing whitespace from last_name before validation' do
        user.validate
        expect(user.last_name).to eq('Doe')
      end
    end
  end
end
