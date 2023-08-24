# == Schema Information
#
# Table name: responses
#
#  id                     :bigint           not null, primary key
#  celebrate_comment      :string
#  comment                :text
#  completed_at           :date
#  draft                  :boolean          default(FALSE), not null
#  gif                    :jsonb
#  not_working            :boolean          default(FALSE)
#  notices                :jsonb
#  productivity           :integer
#  productivity_comment   :text
#  rating                 :integer
#  steps                  :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  emotion_id             :bigint
#  fun_question_answer_id :bigint
#  fun_question_id        :bigint
#  shoutout_id            :bigint
#  time_period_id         :bigint           not null
#  user_id                :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id                  (emotion_id)
#  index_responses_on_fun_question_answer_id      (fun_question_answer_id)
#  index_responses_on_fun_question_id             (fun_question_id)
#  index_responses_on_shoutout_id                 (shoutout_id)
#  index_responses_on_time_period_id              (time_period_id)
#  index_responses_on_user_id                     (user_id)
#  index_responses_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (fun_question_answer_id => fun_question_answers.id)
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class ResponseSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :time_period_id, :emotion_id, :steps, :gif, :rating, :comment, :productivity,
             :productivity_comment, :fun_question_id, :fun_question_answer_id, :shoutout_id, :completed_at, :draft,
             :not_working
end
