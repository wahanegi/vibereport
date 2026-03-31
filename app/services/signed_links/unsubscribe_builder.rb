# frozen_string_literal: true

module SignedLinks
  class UnsubscribeBuilder
    PURPOSE = 'unsubscribe.v1'
    TOKEN_TTL = 7.days
    ROUTE_NAME = :api_v1_unsubscribe_url

    class << self
      def url(user)
        Builder.build_url(
          purpose: PURPOSE,
          payload: { user_id: user.id },
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
