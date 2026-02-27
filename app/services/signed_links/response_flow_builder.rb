# frozen_string_literal: true

module SignedLinks
  class ResponseFlowBuilder
    PURPOSE = 'response_flow.v1'
    TOKEN_TTL = 7.days
    ROUTE_NAME = :api_v1_response_flow_from_email_url

    class << self
      def url(user, time_period, **options)
        Builder.build_url(
          purpose: PURPOSE,
          payload: payload_for(user, time_period, options),
          route_name: ROUTE_NAME,
          expires_in: TOKEN_TTL
        )
      end

      def url_for_emotion(user, time_period, emotion_id)
        url(user, time_period, emotion_id: emotion_id)
      end

      def verify(token)
        Builder.verify(token, purpose: PURPOSE)
      end

      private

      def payload_for(user, time_period, options)
        {
          user_id: user.id,
          time_period_id: time_period.id,
          last_step: options[:last_step],
          not_working: options[:not_working],
          emotion_id: options[:emotion_id],
          completed_at: options[:completed_at]
        }.compact
      end
    end
  end
end
