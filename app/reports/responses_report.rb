class ResponsesReport < AdminReport
  include Chartkick::Helper

  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    response_counts = receive_response_counts
    data = response_data(response_counts)

    chart_id = SecureRandom.uuid
    chart = create_chart(data, chart_id)
    
    { chart: chart, id: chart_id }
  end

  private

  def receive_response_counts
    Response.joins(user: { teams: :users_teams })
            .where(users_teams: { team_id: @team.id })
            .where(time_period_id: @time_periods)
            .distinct
            .group('responses.time_period_id')
            .count
  end

  def response_data(response_counts)
    response_counts.map do |time_period_id, count|
      time_period = TimePeriod.find(time_period_id)
      period = format_period(time_period)
      [period, count]
    end
  end

  def format_period(time_period)
    period_start_date = time_period.start_date.strftime('%Y-%m-%d')
    period_end_date = time_period.end_date.strftime('%Y-%m-%d')
    "#{period_start_date} - #{period_end_date}"
  end

  def create_chart(data, chart_id)
    area_chart data, xtitle: 'Period', ytitle: 'Count', id: chart_id, library: { colors: ['green'], title: { fontName: 'Arial', fontSize: 18 } }    
  end
end
