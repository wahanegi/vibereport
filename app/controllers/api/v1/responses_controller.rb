module Api
  module V1
    class ResponsesController < ApplicationController
      include ApplicationHelper

      PARAMS_ATTRS = [:user_id, :emotion_id, :time_period_id, [steps: []], :not_working, :notices, :rating,
                      :comment, :productivity, :bad_follow_comment, :celebrate_comment, :fun_question_id,
                      :fun_question_answer_id, { gif: %i[src height] }].freeze

      before_action :retrieve_response, only: %i[update]
      before_action :require_user!, only: %i[create update]

      def create
        @response = current_user.responses.build(response_params)
        if @response.save
          render json: ResponseSerializer.new(@response).serializable_hash.merge(additional_data)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @response.update(response_params)
          render json: ResponseSerializer.new(@response).serializable_hash.merge(additional_data)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def response_flow_from_email
        sign_in(user)
        result = ResponseFlowFromEmail.new(params, @user).call
        return redirect_to root_path if result[:success]

        render json: { error: result[:error] }, status: :unprocessable_entity
      end

      private

      def retrieve_response
        @response = Response.find_by(id: params[:id])
      end

      def response_params
        params.require(:response).permit(attributes: PARAMS_ATTRS)
      end

      def additional_data
        {
          emotion: @response.emotion,
          user_shoutouts: current_user.shoutouts
        }
      end

      def user
        @user ||= User.find_by(id: params[:user_id])
      end
    end
  end
end
