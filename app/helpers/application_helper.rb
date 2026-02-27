module ApplicationHelper
  private

  def prev_results_path
    check_period? && TimePeriod.previous_time_period ? "/results/#{TimePeriod.previous_time_period&.slug}" : nil
  end

  def check_period?
    start_day = (ENV['START_WEEK_DAY'] || 'tuesday').strip.capitalize
    end_day = (ENV['DAY_TO_SEND_INVITES'] || 'friday').strip.capitalize
    current_day = Date.current.wday
    current_day >= Date::DAYNAMES.index(start_day) && current_day < Date::DAYNAMES.index(end_day)
  end
end
