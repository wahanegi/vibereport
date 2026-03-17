module ApplicationHelper
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

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

  def check_in_period?
    # TODO: remove - temporarily include all weekdays in development for testing CTA
    return true if Rails.env.development?

    invite_day_name = (ENV['DAY_TO_SEND_INVITES'] || 'friday').strip.capitalize
    final_day_name = (ENV['DAY_TO_SEND_FINAL_REMINDER'] || 'monday').strip.capitalize
    invite_wday = Date::DAYNAMES.index(invite_day_name)
    final_wday = Date::DAYNAMES.index(final_day_name)

    raise "Invalid DAY_TO_SEND_INVITES: #{invite_day_name}" if invite_wday.nil?
    raise "Invalid DAY_TO_SEND_FINAL_REMINDER: #{final_day_name}" if final_wday.nil?

    today_wday = Date.current.wday

    if invite_wday > final_wday
      today_wday >= invite_wday || today_wday <= final_wday
    else
      today_wday >= invite_wday && today_wday <= final_wday
    end
  end
end
