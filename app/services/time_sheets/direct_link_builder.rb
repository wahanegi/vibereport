# frozen_string_literal: true

module TimeSheets
  class DirectLinkBuilder
    def self.call(user, time_period)
      new(user, time_period).call
    end

    def initialize(user, time_period)
      @user = user
      @time_period = time_period
    end

    def call
      token = verifier.generate(payload)
      direct_timesheet_entry_url(token: token)
    end

    private

    attr_reader :user, :time_period

    def payload
      {
        user_id: user.id,
        time_period_id: time_period.id
      }
    end

    def verifier
      @verifier ||= ActiveSupport::MessageVerifier.new(
        Rails.application.secret_key_base,
        serializer: JSON
      )
    end

    def direct_timesheet_entry_url(token:)
      Rails.application.routes.url_helpers.api_v1_direct_timesheet_entry_url(
        token: token,
        **url_options
      )
    end

    def url_options
      ActionMailer::Base.default_url_options.presence || {}
    end
  end
end
