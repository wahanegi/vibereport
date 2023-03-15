module Api
  module V1
    class ResponsesController < ApplicationController
      include ApplicationHelper

      before_action :set_response, only: %i[show update]
      before_action :require_user!, only: [:index, :show, :create, :update]

      def index
        render json: ResponseSerializer.new(Response.all).serializable_hash
      end

      def show
        render json: ResponseSerializer.new(@response).serializable_hash.merge(add_chosen_emotion)
      end

      def create
        @response = current_user.responses.build(response_params)
        if @response.save
          render json: ResponseSerializer.new(@response).serializable_hash.merge(add_chosen_emotion)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def update
         if @response.update(response_params)
          render json: ResponseSerializer.new(@response).serializable_hash.merge(add_chosen_emotion)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def response_flow_from_email
        set_user
        sign_in_user
        return response_not_working_from_emil if params[:not_working].present?

        result = ResponseFlowFromEmail.new(params, @user).call
        return redirect_to "/responses/#{result[:response].id}" if result[:success]

        render json: { error: result[:error] }, status: :unprocessable_entity
      end

      private

      def set_response
        @response = Response.find(params[:id])
      end

      def response_params
        params.require(:response).permit(attributes: [:user_id, :emotion_id, :time_period_id, :steps, :not_working])
      end

      def add_chosen_emotion
        { chosen_emotion: @response.emotion }
      end

      def set_user
        @user = User.find_by(id: params[:user_id])
      end

      def sign_in_user
        sign_in @user
      end

      def response_not_working_from_emil
        response = ResponseNotWorkingFromEmail.new(params, @user).call
        return redirect_to results_path if response[:success]

        render json: { error: response[:error] }, status: :unprocessable_entity
      end
    end
  end
end
