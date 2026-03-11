# frozen_string_literal: true

# TODO: Remove this concern after LEGACY_EMAIL_LINKS_CUTOFF_DATE passes.
# To find all related code: rg "legacy_link_support|legacy_links_allowed|legacy_.*_payload|LEGACY_EMAIL_LINKS_CUTOFF_DATE" app/ spec/
module LegacyEmailLinkSupport
  private

  def legacy_links_allowed?
    cutoff = ENV.fetch('LEGACY_EMAIL_LINKS_CUTOFF_DATE', nil)
    return false if cutoff.blank?

    Date.current <= Date.parse(cutoff)
  rescue Date::Error
    false
  end
end
