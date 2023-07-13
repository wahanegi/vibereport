class ApplicationController < ActionController::Base
  before_action :ensure_proper_subdomain, if: -> { request.get? }

  private

  def ensure_proper_subdomain
    if ENV['DOMAIN_URL'].present? && request.host_with_port != ENV['DOMAIN_URL']
      redirect_to [request.protocol, ENV['DOMAIN_URL'], request.fullpath].join
    end
  end
end
