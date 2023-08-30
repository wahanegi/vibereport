namespace :migration do
  desc 'Migrate CelebrateShoutouts to Shoutouts'
  task celebrate_shoutouts: :environment do
    MigrateShoutoutsWorker.new.process
  end
end