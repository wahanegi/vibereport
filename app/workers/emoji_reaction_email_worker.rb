class EmojiReactionEmailWorker
  attr_reader :time_period

  def initialize
    @time_period = TimePeriod.current
  end

  def run_notification
    reactions = fetch_today_shoutout_reactions
    return if reactions.empty?

    shoutouts = fetch_shoutouts_with_reactions(reactions)
    return if shoutouts.empty?

    reactions_by_shoutout = reactions.group_by(&:emojiable_id)

    shoutouts.group_by(&:user).each do |author, author_shoutouts|
      messages = build_messages_for_author(author_shoutouts, reactions_by_shoutout)
      next if messages.empty?

      EmojiReactionsMailer.emoji_reaction_email(author, messages, time_period).deliver_now
    end
  end

  private

  def fetch_today_shoutout_reactions
    Emoji.where(emojiable_type: 'Shoutout', created_at: Time.current.all_day)
  end

  def fetch_shoutouts_with_reactions(reactions)
    shoutout_ids = reactions.pluck(:emojiable_id).uniq
    Shoutout.where(id: shoutout_ids, time_period: @time_period)
  end

  def build_messages_for_author(shoutouts, reactions_by_shoutout)
    shoutouts.filter_map do |shoutout|
      build_message_for_shoutout(shoutout, reactions_by_shoutout[shoutout.id])
    end
  end

  def build_message_for_shoutout(shoutout, reactions)
    return if reactions.blank?

    recipient_names = extract_recipient_names(shoutout)
    reactor_names = extract_reactor_names(reactions)

    if recipient_names.present?
      "A shoutout you wrote for #{recipient_names} received reactions from #{reactor_names}."
    else
      "One of your shoutouts without specific recipients received reactions from #{reactor_names}."
    end
  end

  def extract_recipient_names(shoutout)
    shoutout.shoutout_recipients
            .filter_map { |r| r.user&.full_name }
            .to_sentence
  end

  def extract_reactor_names(reactions)
    reactions.filter_map { |r| r.user&.full_name }
             .uniq
             .to_sentence
  end
end
