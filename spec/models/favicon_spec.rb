require 'rails_helper'

RSpec.describe Favicon, type: :model do
  describe 'validations' do
    context 'when image is attached' do
      let!(:logo) { create :logo, :image, type: 'Favicon' }

      it 'is valid with a valid image type and size' do
        expect(logo).to be_valid
      end

      it 'is invalid with an invalid image type' do
        logo.image.attach(io: File.open('spec/fixtures/files/invalid_image.txt'), filename: 'invalid_image.txt', content_type: 'text/plain')
        expect(logo).to be_invalid
        expect(logo.errors[:image]).to include("Not valid type (allowed: #{Logo::ALLOWED_TYPES.join(', ').gsub('image/', '')})")
      end
    end

    context 'when image is not attached' do
      let(:logo) { FactoryBot.build(:logo, image: nil) }

      it 'is valid' do
        expect(logo).to be_valid
      end
    end
  end

  describe '#image_url' do
    context 'when image is attached' do
      let!(:logo) { create :logo, :image }

      it 'returns the URL of the attached image' do
        expect(logo.image_url).to eq(Rails.application.routes.url_helpers.rails_blob_path(logo.image, only_path: true))
      end
    end

    context 'when image is not attached' do
      let(:logo) { FactoryBot.build(:logo, image: nil) }

      it 'returns nil' do
        expect(logo.image_url).to be_nil
      end
    end
  end
end
