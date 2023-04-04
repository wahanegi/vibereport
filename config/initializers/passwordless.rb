Passwordless.default_from_address = "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"
Passwordless.failure_redirect_path = "/"
Passwordless.success_redirect_path = "/app"
Passwordless.expires_at = lambda { 1.week.from_now }
