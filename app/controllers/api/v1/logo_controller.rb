class Api::V1::LogoController < ApplicationController
  def index
    logo = Logo.where(type: 'Logo').last
    render json: logo&.image_url || {}, status: :ok
  end
end
