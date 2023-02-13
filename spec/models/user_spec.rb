require 'rails_helper'

RSpec.describe User, type: :model do
  let!(:user) { create :user }

  context 'Validations' do
    subject { FactoryBot.build(:user) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }

    it 'fails from 2 to 5 characters' do
      user.password = Faker::Internet.password(min_length: 2, max_length: 5)
      expect(user).to_not be_valid
    end
    it 'passes more then 6 characters' do
      user.password = Faker::Internet.password(min_length: 6, max_length: 128)
      expect(user.valid?).to be_truthy
    end
    it 'is valid email' do
      user.email = Faker::Internet.email
      expect(user.valid?).to be_truthy
    end
    it 'is not valid email' do
      user.email = "qwerty"
      expect(user.valid?).to be_falsey
    end
    it 'is invalid if the email is not unique' do
      User.create(email: user.email).invalid?
    end
  end
end
