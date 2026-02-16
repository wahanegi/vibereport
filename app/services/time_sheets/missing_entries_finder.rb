module TimeSheets
  class MissingEntriesFinder
    def self.call(...)
      new(...).call
    end

    def initialize(time_periods: TimePeriod.all)
      @time_periods = time_periods
    end

    def call
      result = {}

      eligible_users.find_each do |user|
        missing_periods = missing_periods_for(user)
        next if missing_periods.blank?

        result[user] = missing_periods if missing_periods.any?
      end

      result
    end

    private

    def eligible_users
      User
        .joins(user_teams: :team)
        .where(teams: { timesheet_enabled: true })
        .where(opt_out: false)
        .distinct
    end

    def missing_periods_for(user)
      @time_periods
        .where
        .not(
          id: TimeSheetEntry
                .where(user_id: user.id)
                .select(:time_period_id)
        )
        .ordered
    end
  end
end
