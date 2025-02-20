class AdminReport
  attr_reader :team

  def initialize(team = nil)
    @team = team
  end
end
