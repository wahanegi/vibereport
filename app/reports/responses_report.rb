class ResponsesReport < AdminReport
  include Chartkick::Helper

  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    data = response_data(receive_response_counts)

    chart_id = SecureRandom.uuid
    chart = create_chart(data, chart_id)

    [chart, chart_id]
  end

  private

  def receive_response_counts
    Response.joins(user: { teams: :user_teams })
            .where(user_teams: { team_id: @team.id })
            .where(time_period_id: @time_periods)
            .distinct
            .group('responses.time_period_id')
            .count
  end

  def response_data(response_counts)
    time_periods = TimePeriod.select(:id, :start_date, :end_date)
                             .where(id: response_counts.keys)

    response_counts.map do |time_period_id, count|
      time_period = time_periods.find { |tp| tp.id == time_period_id }
                                .date_range
      [time_period, count]
    end
  end

  def create_chart(data, chart_id)
    area_chart data,
               xtitle: 'Period', ytitle: 'Count', id: chart_id,
               library: { colors: ['green'], title: { fontName: 'Arial', fontSize: 18 } }
  end
end
