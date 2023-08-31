class MigrateShoutoutsWorker
  attr_reader :celebrate_shoutouts

  def initialize
    @celebrate_shoutouts = CelebrateShoutout.all
  end

  def process
    ApplicationRecord.transaction do
      update_celebrate_shoutouts!
      p "Successfully updated #{@celebrate_shoutouts.count} CelebrateShoutouts!"
    rescue StandardError => e
      p "Error: #{e.message}!"
    end
  end

  private

  def update_celebrate_shoutouts!
    celebrate_shoutouts.each do |celebrate_shoutout|
      rich_text = mention_to_rich_text(celebrate_shoutout.rich_text)
      celebrate_shoutout.update!(rich_text:, type: nil)
    end
  end

  def mention_to_rich_text(mention)
    reg_exp_start = /@\[/
    reg_exp_end = /\]\(\d+\)/
    mention.gsub(reg_exp_start, '<span class="color-primary">@').gsub(reg_exp_end, '</span>')
  end
end