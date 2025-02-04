# frozen_string_literal: true

class Devise::Passwordless::SessionsController < Devise::SessionsController
  def create
    self.resource = resource_class.find_by(email: create_params[:email].downcase)
    resource.send_magic_link(remember_me: true) if self.resource

    self.resource = resource_class.new(create_params)
    redirect_to sent_path
  end

  protected

  def translation_scope
    if action_name == 'create'
      'devise.passwordless'
    else
      super
    end
  end

  private

  def create_params
    resource_params.permit(:email, :token)
  end
end
