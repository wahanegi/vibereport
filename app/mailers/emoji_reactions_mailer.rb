class EmojiReactionsMailer < ApplicationMailer
  def emoji_reaction_email(author, messages, time_period)
    @time_period = time_period
    @author = author
    @messages = messages
    @url = "https://#{ENV.fetch('DOMAIN_URL')}"

    mail(to: @author.email, subject: random_emoji_reaction_subject)
  end

  private

  def random_emoji_reaction_subject
    [
      'People are reacting to your shoutouts',
      'Your shoutouts are receiving attention',
      'Someone thinks your shoutouts are awesome',
      'Your shoutouts are being appreciated'
    ].sample
  end
end
