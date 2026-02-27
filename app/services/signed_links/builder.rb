# frozen_string_literal: true

module SignedLinks
  class Builder
    DEFAULT_EXPIRES_IN = 7.days

    class << self
      def build_url(purpose:, payload:, route_name:, expires_in: DEFAULT_EXPIRES_IN)
        token = Tokens::SignedToken.encode(payload, purpose: purpose, expires_in: expires_in)
        url_helpers.public_send(route_name, token: token, **url_options)
      end

      def verify(token, purpose:)
        Tokens::SignedToken.decode(token, purpose: purpose)
      end

      private

      def url_helpers
        Rails.application.routes.url_helpers
      end

      def url_options
        ActionMailer::Base.default_url_options.presence || {}
      end
    end
  end
end
