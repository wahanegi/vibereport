# frozen_string_literal: true

module SignedLinks
  class ResultsEmailBuilder
    PURPOSE = 'results_email.v1'
    TOKEN_TTL = 7.days
    ROUTE_NAME = :api_v1_results_email_url

    class << self
      def url(user, time_period)
        Builder.build_url(
          purpose: PURPOSE,
          payload: { user_id: user.id, time_period_slug: time_period.slug },
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
