# frozen_string_literal: true

module Tokens
  class SignedToken
    DEFAULT_EXPIRES_IN = 7.days
    SALT = 'signed_token.v1'

    class << self
      def encode(payload, purpose:, expires_in: DEFAULT_EXPIRES_IN)
        raise ArgumentError, 'purpose is required' if blank_purpose?(purpose)
        raise ArgumentError, 'payload must be a Hash' unless payload.is_a?(Hash)

        verifier.generate(
          wrap_payload(payload, purpose),
          expires_in: expires_in
        )
      end

      def decode(token, purpose:)
        return nil if token.blank?
        raise ArgumentError, 'purpose is required' if blank_purpose?(purpose)

        data = verifier.verified(token)
        return nil if data.blank?
        return nil unless data.is_a?(Hash)

        token_purpose = data['purpose'] || data[:purpose]
        return nil unless token_purpose.to_s == purpose.to_s

        payload = data['payload'] || data[:payload]
        return nil unless payload.is_a?(Hash)

        payload.with_indifferent_access
      rescue ActiveSupport::MessageVerifier::InvalidSignature,
             JSON::ParserError
        nil
      end

      private

      def blank_purpose?(purpose)
        purpose.nil? || purpose.to_s.strip.empty?
      end

      def wrap_payload(payload, purpose)
        {
          purpose: purpose.to_s,
          payload: payload
        }
      end

      def verifier
        @verifier ||= ActiveSupport::MessageVerifier.new(
          derived_secret,
          serializer: JSON
        )
      end

      def derived_secret
        Rails.application.key_generator.generate_key(SALT, 32)
      end
    end
  end
end
