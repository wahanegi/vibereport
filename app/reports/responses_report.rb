class ResponsesReport < AdminReport
  include Chartkick::Helper
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    response_counts = Response.joins(user: { teams: :users_teams })
                              .where(users_teams: { team_id: @team.id })
                              .where(time_period_id: @time_periods)
                              .distinct
                              .group('responses.time_period_id')
                              .count
    data = response_counts.map do |time_period_id, count|
      time_period = TimePeriod.find(time_period_id)
      period_start_date = time_period.start_date
      period_end_date = time_period.end_date
      period = "#{period_start_date.strftime('%Y-%m-%d')} - #{period_end_date.strftime('%Y-%m-%d')}"
      [period, count]
    end

    chart_id = SecureRandom.uuid
    chart = area_chart data, xtitle: 'Period', ytitle: 'Count', id: chart_id, library: { title: { fontName: 'Arial', fontSize: 18 } }    
    { chart: chart, id: chart_id }
  end
end
