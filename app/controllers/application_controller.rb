class ApplicationController < ActionController::Base
  before_action :ensure_proper_subdomain, if: -> { request.get? }

  private

  def ensure_proper_subdomain
    domain_url = ENV['DOMAIN_URL']
    return unless domain_url.present? && request.host_with_port != domain_url

    redirect_to [request.protocol, domain_url, request.fullpath].join
  end
end
