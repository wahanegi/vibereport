Passwordless.default_from_address = "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
Passwordless.success_redirect_path  = "/app"
Passwordless.failure_redirect_path = "/sign_in"
Passwordless.expires_at = lambda { 1.week.from_now }