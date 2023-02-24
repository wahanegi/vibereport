Passwordless.default_from_address = "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
if Rails.env.production?
  # entry point of React
  Passwordless.success_redirect_path = "https://#{ENV.fetch('EMAIL_DOMAIN')}/app"
  Passwordless.failure_redirect_path = "https://#{ENV.fetch('EMAIL_DOMAIN')}/home"
else
  url = Rails.application.config.action_mailer.default_url_options
  url_port = "#{url[:host]}:#{url[:port]}"
  Passwordless.success_redirect_path = "http://#{url_port}/temporary_blank_page"
  Passwordless.failure_redirect_path = "http://#{url_port}/home"
end