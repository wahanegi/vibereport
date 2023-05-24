namespace :reminder_email do
  desc 'Send reminder email to users with uncompleted check-ins'
  task send_reminder_email: :environment do
    ReminderEmailWorker.new.perform(user.id)
    # users_with_uncompleted_check_ins = User.where(opt_out: true)
    #                                        # .where.not(check_in_completed: true)
    #
    # users_with_uncompleted_check_ins.each do |user|
    #   ReminderEmailWorker.new.perform(user.id)
    # end
  end
end

# namespace :reminder_email do
#   desc 'Send reminder email to users with uncompleted check-ins'
#   task send_reminder_email: :environment do
#     User.find_each do |user|
#       ReminderEmailWorker.new.perform(user.id)
#     end
#   end
# end
namespace :reminder_email do
  desc 'Send reminder email to users'
  task send_reminder_email: :environment do
    User.find_each do |user|
      ReminderEmailWorker.perform(user.id)
    end
  end
end