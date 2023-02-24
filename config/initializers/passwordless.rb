Passwordless.default_from_address = "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
Passwordless.failure_redirect_path = "/home"

  # entry point of React. When React will be ready please uncomment
  # Passwordless.success_redirect_path = "/app"

  # When will be work next step(React page) please comment it
  Passwordless.success_redirect_path = "/temporary_blank_page"
