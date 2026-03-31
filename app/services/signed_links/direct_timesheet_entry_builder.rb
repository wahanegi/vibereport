# frozen_string_literal: true

module SignedLinks
  class DirectTimesheetEntryBuilder
    PURPOSE = 'timesheets.direct_entry.v1'
    TOKEN_TTL = 7.days
    ROUTE_NAME = :api_v1_direct_timesheet_entry_url

    def self.call(user, time_period)
      new(user, time_period).call
    end

    def self.verify(token)
      Builder.verify(token, purpose: PURPOSE)
    end

    def initialize(user, time_period)
      @user = user
      @time_period = time_period
    end

    def call
      Builder.build_url(
        purpose: PURPOSE,
        payload: payload,
        route_name: ROUTE_NAME,
        expires_in: TOKEN_TTL
      )
    end

    private

    attr_reader :user, :time_period

    def payload
      { user_id: user.id, time_period_id: time_period.id }
    end
  end
end
