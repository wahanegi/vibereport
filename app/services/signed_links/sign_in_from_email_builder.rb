# frozen_string_literal: true

module SignedLinks
  class SignInFromEmailBuilder
    PURPOSE = 'sign_in_from_email.v1'
    TOKEN_TTL = 7.days
    ROUTE_NAME = :api_v1_sign_in_from_email_url

    class << self
      def url(user)
        payload = { user_id: user.id }

        Builder.build_url(
          purpose: PURPOSE,
          payload: payload,
          route_name: ROUTE_NAME,
          expires_in: TOKEN_TTL
        )
      end

      def verify(token)
        Builder.verify(token, purpose: PURPOSE)
      end
    end
  end
end
