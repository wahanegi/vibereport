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

      users = eligible_users.to_a
      return result if users.empty?

      user_ids = users.map(&:id)
      period_ids = @time_periods.ordered.pluck(:id)
      return result if period_ids.empty?

      periods = @time_periods.ordered.to_a
      periods_by_id = periods.index_by(&:id)

      entries_by_user_id = fetch_entries_by_user(user_ids, period_ids)

      users.each do |user|
        missing_ids = missing_period_ids_for_user(user, period_ids, entries_by_user_id)
        next if missing_ids.empty?

        # Map missing IDs to period objects (filter_map ignoring any nils)
        missing_periods = missing_ids.filter_map { |id| periods_by_id[id] }
        next if missing_periods.empty?

        result[user] = missing_periods
      end
      result
    end

    private

    def eligible_users
      User
        .joins(user_teams: :team)
        .where(teams: { timesheet_enabled: true })
        .opt_in
        .distinct
    end

    def fetch_entries_by_user(user_ids, period_ids)
      entries = TimeSheetEntry.for_users_and_periods(user_ids, period_ids)
      entries.group_by(&:user_id)
    end

    def missing_period_ids_for_user(user, period_ids, entries_by_user_id)
      user_entries = entries_by_user_id[user.id] || []
      present_period_ids = user_entries.map(&:time_period_id)

      # Determine which period IDs are missing for the user
      period_ids - present_period_ids
    end
  end
end
