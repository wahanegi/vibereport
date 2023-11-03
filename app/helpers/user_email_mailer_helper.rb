# frozen_string_literal: true

# methods for UserEmailMailer

NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

module UserEmailMailerHelper
  def btn_special(word, attr)
    case attr
    when :width
      word.length > 11 ? word.length * 11 : 127
    when :margin
      word.length > 11 ? (25 - (((word.length * 11) - 127) / 2.0)) : 25
    else
      'wrong attribute'
    end
  end

  def emotions_table
    table = []
    emotions = Emotion.emotion_public.positive.sample(NUMBER_OF_ELEMENTS) +
               Emotion.emotion_public.negative.sample(NUMBER_OF_ELEMENTS)
    emotions.each_slice(6) { |sliced_emotions| table << sliced_emotions }
    table = table.transpose.flatten
  end

  def random_remind_checkin_subject(time_period)
    [
      'Last chance to check in!',
      "Reminder to complete your Vibereport check-in for #{time_period.date_range}",
      'Must check in today',
      'Your input is valuable'
    ].sample
  end

  def who_is_waiting(user, time_period)
    teams = user.teams
    teams_with_managers = Team.joins(:user_teams).where(user_teams: { role: :manager }).uniq
    is_manager = user.user_teams.managers.any?
    managers = User.joins(:user_teams).where(user_teams: { role: :manager, team_id: teams.ids }).uniq
    text_for_waiting(is_manager, teams_with_managers, managers, time_period)
  end

  private

  def text_for_waiting(is_manager, teams_with_managers, managers, time_period)
    if is_manager && teams_with_managers.any?
      "The #{teams_with_managers.pluck(:name).to_sentence} #{'team'.pluralize(teams_with_managers.count)} " \
        "#{teams_with_managers.count == 1 ? 'is' : 'are'} waiting for you to check-in for #{time_period.date_range_str}"
    elsif managers.any?
      "#{managers.pluck(:first_name).to_sentence} #{managers.count == 1 ? 'is' : 'are'} " \
        "waiting for you to check-in for #{time_period.date_range_str}"
    end
  end
end
