class HomeController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: :app

  def index
  end

  def app
  end

  def temporary_sign_in_blank_page_for_test
  end
end
