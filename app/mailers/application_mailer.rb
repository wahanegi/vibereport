class ApplicationMailer < ActionMailer::Base
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"

  layout "mailer"
end
