Passwordless.default_from_address = "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
Passwordless.redirect_back_after_sign_in = "/temporary_sign_in_blank_page_for_test"
Passwordless.failure_redirect_path = "/home"