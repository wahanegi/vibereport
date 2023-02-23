class HomeController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: :app

  def index
  end

  def app
  end
end
