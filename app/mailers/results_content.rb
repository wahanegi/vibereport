class ResultsContent
  attr_reader :user, :time_period, :fun_question

  def initialize(user, time_period, fun_question)
    @user = user
    @time_period = time_period
    @fun_question = fun_question
  end

  def subject
    if fun_question&.user_id == user.id
      "#{count_fun_question_answer} people answered a fun question that you submitted"
    elsif user.mentions.where(time_period_id: time_period.id).any?
      "Hey #{user.first_name}, you received shoutouts!"
    elsif shoutouts_with_public_true?
      'One of your teammates received shoutouts!'
    else
      "Hey #{user.first_name}, the results are in!"
    end
  end

  def main_header
    if @fun_question&.user_id == @user.id
      'See what they said!'
    elsif @user.mentions.where(time_period_id: @time_period.id).any?
      'You received shoutouts!'
    else
      'Submissions are in!'
    end
  end

  def sub_header
    fun_question&.question_body if fun_question&.user_id == user.id
  end

  private

  def count_fun_question_answer
    fun_question.fun_question_answers.size
  end

  def shoutouts_with_public_true?
    Shoutout
      .joins(:shoutout_recipients)
      .where(public: true)
      .where(time_period_id: time_period.id)
      .where(shoutout_recipients: { user_id: user.teams.map { |team| team.users.ids }.flatten.uniq.reject { |id| id == user.id } }).any?
  end
end
