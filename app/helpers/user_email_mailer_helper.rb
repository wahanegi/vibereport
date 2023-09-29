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
    is_manager = user.user_teams.manager.any?
    "The #{teams.pluck(:name).to_sentence} #{pluralize(teams.count, 'team')}" \
      "are waiting for you to check-in for #{time_period.date_range}"
  end
end
