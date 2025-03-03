# app/models/concerns/soft_deletable.rb
module SoftDeletable
  extend ActiveSupport::Concern

  included do
    scope :deleted, -> { where.not(deleted_at: nil) }
    scope :active, -> { where(deleted_at: nil) }
  end

  def soft_delete!
    update(deleted_at: Time.current)
  end

  def restore!
    update(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end
end
