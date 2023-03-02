Passwordless.default_from_address = "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
Passwordless.failure_redirect_path = "/"
Passwordless.success_redirect_path = "/app"
Passwordless.expires_at = lambda { 1.week.from_now }
