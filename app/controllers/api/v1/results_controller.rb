class Api::V1::ResultsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, :time_period, only: %i[show]

  def show
    render json: Api::V1::ResultsPresenter.new(@time_period.id).json_hash
  end

  private

  def time_period
    @time_period = TimePeriod.find_by(id: params[:id])
  end
end
