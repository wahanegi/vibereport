# == Schema Information
#
# Table name: logos
#
#  id         :bigint           not null, primary key
#  type       :string           default("Logo")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Logo < ApplicationRecord
  include CommonHelper
  ALLOWED_TYPES = %w[image/jpeg image/png image/gif].freeze
  MAX_FILE_SIZE = 2.megabytes

  has_one_attached :image
  validate :logo_type_and_size

  def image_url
    Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true) if image.attached?
  end

  private

  def logo_type_and_size
    return unless image.attached?

    type_message = "Not valid type (allowed: #{ALLOWED_TYPES.join(', ').gsub('image/', '')})"
    size_message = "Size exceeds the maximum allowed limit: #{bytes_to_megabytes(MAX_FILE_SIZE)}MB)"
    errors.add(:image, type_message) unless ALLOWED_TYPES.include?(image.blob.content_type)
    errors.add(:image, size_message) if image.blob.byte_size > MAX_FILE_SIZE
  end
end
