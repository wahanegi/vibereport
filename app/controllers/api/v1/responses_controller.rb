module Api
  module V1
    class ResponsesController < ApplicationController
      PARAMS_ATTRS = [:user_id, :emotion_id, :time_period_id, [steps: []], :not_working, :notices, :rating,
                      :comment, :productivity, :productivity_comment, :fun_question_id, :shoutout_id,
                      :fun_question_answer_id, :completed_at, :draft, :celebrate_comment, { gif: %i[src height] }].freeze

      before_action :retrieve_response, only: %i[update]
      before_action :authenticate_user!, only: %i[create update]

      def create
        @response = current_user.responses.build(response_params)
        if @response.save
          reset_time_period_index
          render json: ResponseSerializer.new(@response).serializable_hash.merge(additional_data)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def update
        complete_response
        remove_related_data
        if @response.update!(response_params)
          render json: ResponseSerializer.new(@response).serializable_hash.merge(additional_data)
        else
          render json: { error: @response.errors }, status: :unprocessable_entity
        end
      end

      def response_flow_from_email
        payload = SignedLinks::ResponseFlowBuilder.verify(params[:token])
        return redirect_to_invalid_link if payload.blank?

        @user = User.find_by(id: payload[:user_id].to_i)
        return redirect_to_invalid_link if @user.blank?

        time_period = TimePeriod.find_by(id: payload[:time_period_id].to_i)
        return redirect_to_invalid_link if time_period.blank?

        sign_in @user
        reset_time_period_index
        result = ResponseFlowFromEmail.new(
          @user,
          time_period_id: payload[:time_period_id].to_i,
          last_step: payload[:last_step],
          not_working: payload[:not_working],
          emotion_id: payload[:emotion_id]&.to_i,
          completed_at: payload[:completed_at]
        ).call
        if payload[:time_period_id].to_i == TimePeriod.current.id
          return redirect_to root_path if result[:success]

          render json: { error: result[:error] }, status: :unprocessable_entity
        else
          session[:check_in_time_period_id] = payload[:time_period_id].to_i
          redirect_to '/check-in-closed'
        end
      end

      def sign_out_user
        retrieve_response
        ReminderEmailWorker.new(current_user, @response, TimePeriod.current).run_notification if @response&.completed_at.nil?
        sign_out(current_user) if user_signed_in?
        redirect_to new_user_session_path
      end

      def sign_in_from_email
        payload = SignedLinks::SignInFromEmailBuilder.verify(params[:token])
        return redirect_to_invalid_link if payload.blank?

        @user = User.find_by(id: payload[:user_id].to_i)
        return redirect_to_invalid_link if @user.blank?

        sign_in @user
        redirect_to root_path
      end

      private

      def retrieve_response
        @response ||= Response.find_by(id: params[:id])
      end

      def response_params
        params.require(:response).permit(attributes: PARAMS_ATTRS)
      end

      def additional_data
        {
          emotion: @response.emotion,
          user_shoutouts: current_user.shoutouts.not_celebrate,
          current_user:
        }
      end

      def user
        @user ||= User.find_by(id: params[:user_id])
      end

      def redirect_to_invalid_link
        redirect_to new_user_session_path, alert: 'Invalid or expired link'
      end

      def complete_response
        return if response_params.dig('attributes', 'steps')&.exclude?('results') || @response.completed_at.present?

        @response.update(completed_at: Date.current)
      end

      def remove_related_data
        return unless params.dig('response', 'attributes', 'not_working')

        current_user.shoutouts.where(time_period_id: TimePeriod.current.id).destroy_all
        @response.fun_question_answer&.destroy
      end

      def reset_time_period_index
        current_user.update!(time_period_index: 0)
      end
    end
  end
end
