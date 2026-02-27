require 'active_support/core_ext/integer/time'

Rails.application.configure do
  config.after_initialize do
    Bullet.enable        = true
    Bullet.console       = true
    Bullet.rails_logger  = true
  end

  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  config.assets.debug = true

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }

  config.action_mailer.delivery_method = :letter_opener
  config.action_mailer.perform_deliveries = true
  config.assets.debug = true

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.asset_host = 'http://localhost:3000'
  Rails.application.routes.default_url_options = { host: 'http://localhost:3000' }
  config.hosts.clear
end

# For seeding
ENV['ADMIN_USER'] = 'admin@example.com'
ENV['ADMIN_PASSWORD'] = 'password'

# General use
ENV['DAY_TO_SEND_INVITES'] = 'friday'
ENV['DAY_TO_SEND_RESULTS_EMAIL'] = 'tuesday'
ENV['DAY_TO_SEND_FINAL_REMINDER'] = 'monday'
ENV['EMAIL_DOMAIN'] = 'vibereport.app'
ENV['DEFAULT_FROM_ADDRESS'] = 'hello'
ENV['GIPHY_API_KEY'] = 'v6xr0UlohPqB69kIH5HlnmIIGxc34EaS'

# Do NOT hard-code TIMESHEET_START_FORCED_ENTRY_DATE here.
# For local testing, set ENV['TIMESHEET_START_FORCED_ENTRY_DATE'] in your shell.
# Expected format: MM-DD-YYYY (e.g., 01-31-2026).
#
# Example (in your terminal):
#   export TIMESHEET_START_FORCED_ENTRY_DATE=01-31-2026
#   bin/rails c
#   ENV['TIMESHEET_START_FORCED_ENTRY_DATE'] # => "01-31-2026"
#
# When not set, reminders will not be force-enabled in development.
