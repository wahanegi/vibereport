source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.2'

gem 'activeadmin', '~> 2.13', '>= 2.13.1'                     # The administration framework for Ruby on Rails
gem 'awesome_print', '~> 1.9', '>= 1.9.2'                     # Nicely formatted data structures in console.
gem 'bootsnap', require: false                                # Reduces boot times through caching; required in config/boot.rb
gem 'chartkick', '~> 5.0', '>= 5.0.2'                         # Create beautiful Javascript charts with one line of Ruby
gem 'cssbundling-rails', '~> 1.1', '>= 1.1.2'                 # Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem 'devise', '~> 4.8'                                        # Flexible authentication solution for Rails with Warden
gem 'devise-passwordless'                                     # A passwordless a.k.a. "magic link" login strategy
gem 'groupdate', '~> 6.2', '>= 6.2.1'                         # The simplest way to group temporal data
gem 'jbuilder', '~> 2.11', '>= 2.11.5'                        # Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jsbundling-rails', '~> 1.1', '>= 1.1.1'                  # Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem 'jsonapi-serializer', '~> 2.2'                            # Fast, simple and easy to use JSON:API serialization library (also known as fast_jsonapi).
gem 'nokogiri'                                                # premailer-rails requires either nokogiri or hpricot.
gem 'pg', '~> 1.1'                                            # Postgres gem
gem 'premailer-rails'                                         # gem is a drop in solution for styling HTML emails with CSS without having to do the hard work yourself.
gem 'puma', '~> 5.6', '>= 5.6.7'                              # Webserver recommended by heroku: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server
gem 'rack-cors', '~> 2.0', '>= 2.0.1'                         # Middleware that will make Rack-based apps CORS compatible. Fork the project here: https://github.com/cyu/rack-cors
gem 'rails', '~> 7.0.4', '>= 7.0.4.2'                         # Ruby on Rails is a full-stack web framework.
gem 'redis', '~> 4.0'                                         # A Ruby client that tries to match Redis' API one-to-one
gem 'rubocop', '~> 1.45', '>= 1.45.1', require: false         # A Ruby static code analyzer https://github.com/bbatsov/rubocop
gem 'rubocop-performance', '~> 1.16', require: false          # A rubocop Performance extension
gem 'rubocop-rails', '~> 2.17', '>= 2.17.4', require: false   # Automatic Rails code style checking tool. A RuboCop extension focused on enforcing Rails best practices and coding conventions.
gem 'sassc-rails', '~> 2.1', '>= 2.1.2'                       # This gem integrates the C implementation of Sass, LibSass, into the asset pipeline.
gem 'smarter_csv', '~> 1.8', '>= 1.8.4'                       # This gem for smarter importing of CSV Files as Array(s) of Hashes, with optional features for processing large files in parallel.
gem 'sprockets-rails', '~> 3.4', '>= 3.4.2'                   # The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'stimulus-rails', '~> 1.2', '>= 1.2.2'                    # Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem 'turbo-rails', '~> 1.3', '>= 1.3.3'                       # Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby] # Windows does not include zoneinfo files, so bundle the tzinfo-data gem #A passwordless a.k.a. "magic link" login strategy

group :development, :test do
  gem 'debug', platforms: %i[mri mingw x64_mingw]                 # Debugging functionality for Ruby.
  gem 'dotenv-rails', '~> 2.1', '>= 2.1.1'                        # Allows override of local ENV variables in an .env file (see https://github.com/bkeepers/dotenv#usage)
  gem 'factory_bot_rails'                                         # Test data generator -- see spec/support/factory_helper.rb
  gem 'faker', :git => 'https://github.com/faker-ruby/faker.git'  # Easy way to add fake data: names, email addresses, etc.
  gem 'rspec-rails'                                               # rspec-rails is a testing framework for Rails 5+.
end

group :development do
  gem 'annotate'                      # Annotates Rails/ActiveRecord Models, routes, fixtures, and others based on the database schema.
  gem 'bullet'                        # Finds N+1 queries on app
  gem 'fix-db-schema-conflicts'       # Ensures consistent output of db/schema.rb despite local differences in the database
  gem 'git-smart'                     # Installs some additional 'smart' git commands, like `git smart-pull`.
  gem 'letter_opener_web'             # Gives letter_opener an interface for browsing sent emails. Configuration not added  - gem 'letter_opener_web'
  gem 'web-console'                   , '>= 4.2.1' # Access an IRB console on exceptions page/console
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'                      # Capybara is an integration testing tool for rack based web applications. It simulates how a user would interact with a website
  gem 'rails-controller-testing'      # Extracting `assigns` and `assert_template` from ActionDispatch.
  gem 'rspec-json_expectations'       # for testing a JSON response
  gem 'selenium-webdriver'            # It aims to mimic the behaviour of a real user as it interacts with the application's HTML. It's primarily intended for web application testing, but any web-based task can automated.
  gem 'shoulda-callback-matchers'     # Matchers to test before, after and around hooks
  gem 'shoulda-matchers'              # Collection of testing matchers extracted from Shoulda http://thoughtbot.com/community
  gem 'simplecov', require: false     # Code coverage for Ruby. See https://github.com/simplecov-ruby/simplecov for setting options
  gem 'webdrivers'                    # Run Selenium tests more easily with install and updates for all supported webdrivers.
end

group :production do
  gem 'postmark-rails', '~> 0.22.1'   # Mail service for our production server: https://www.postmarkapp.com
end