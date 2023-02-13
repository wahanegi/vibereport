source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.2'

gem 'bootsnap', require: false        # Reduces boot times through caching; required in config/boot.rb
gem 'cssbundling-rails'               # Bundle and process CSS [https://github.com/rails/cssbundling-rails]
# gem 'image_processing', '~> 1.2'    # Use Active Storage, generating image
gem 'jbuilder'                        # Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jsbundling-rails'                # Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
# gem 'kredis'                        # Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
gem 'pg', '~> 1.1'                    # Postgres gem
gem 'puma', '~> 5.0'                  # Webserver recommended by heroku: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server
gem 'rails', '~> 7.0.4', '>= 7.0.4.2' # Ruby on Rails is a full-stack web framework.
gem 'redis', '~> 4.0'                 # A Ruby client that tries to match Redis' API one-to-one
# gem 'sassc-rails'                   # This gem integrates the C implementation of Sass, LibSass, into the asset pipeline.
gem 'sprockets-rails'                 # The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'stimulus-rails'                  # Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem 'turbo-rails'                     # Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby] # Windows does not include zoneinfo files, so bundle the tzinfo-data gem

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw] # Debugging functionality for Ruby.
  gem 'factory_bot_rails'                         # Test data generator -- see spec/support/factory_helper.rb
  gem 'faker', :git => 'https://github.com/faker-ruby/faker.git', :branch => 'main' # Easy way to add fake data: names, email addresses, etc.
  gem 'rspec-rails'                               # rspec-rails is a testing framework for Rails 5+.
end

group :development do
  gem 'annotate'                      # Annotates Rails/ActiveRecord Models, routes, fixtures, and others based on the database schema.
  gem 'fix-db-schema-conflicts'       # Ensures consistent output of db/schema.rb despite local differences in the database
  gem 'git-smart'                     # Installs some additional 'smart' git commands, like `git smart-pull`.
  gem 'letter_opener_web'             # Gives letter_opener an interface for browsing sent emails. Configuration not added  - gem 'letter_opener_web'
  gem 'rubocop-rails', require: false # Automatic Rails code style checking tool. A RuboCop extension focused on enforcing Rails best practices and coding conventions.
  gem 'web-console'                   # Access an IRB console on exceptions page/console
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'                      # Capybara is an integration testing tool for rack based web applications. It simulates how a user would interact with a website
  gem 'rails-controller-testing'      # Extracting `assigns` and `assert_template` from ActionDispatch.
  gem 'selenium-webdriver'            # It aims to mimic the behaviour of a real user as it interacts with the application's HTML. It's primarily intended for web application testing, but any web-based task can automated.
  gem 'shoulda-callback-matchers'     # Matchers to test before, after and around hooks
  gem 'shoulda-matchers'              # Collection of testing matchers extracted from Shoulda http://thoughtbot.com/community
  gem 'webdrivers'                    # Run Selenium tests more easily with install and updates for all supported webdrivers.
end
