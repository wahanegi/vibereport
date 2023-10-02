require 'rails_helper'

RSpec.describe Api::V1::FunQuestionAnswersController do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question, time_period: }
  let!(:fun_question_answer) { create :fun_question_answer, user:, fun_question: }
  let!(:answer_emoji) { create(:emoji, emoji_code: ':open_mouth:', user_id: user.id, emojiable: fun_question_answer) }
  let!(:params) do
    {
      emoji_object: {
        emoji_code: :smile_face,
        emoji_name: 'smile',
        emojiable_id: fun_question_answer.id,
        emojiable_type: 'FunQuestionAnswer'
      }
    }
  end

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      subject { post '/api/v1/emojis/', params: }
      it 'creates a new answer fun question' do
        expect { subject }.to change(Emoji, :count).by(1)
      end

      it 'renders a JSON response with the new answer fun question' do
        subject
        emoji = Emoji.last
        expect([response.parsed_body]).to eq [{ 'data' => {
          'emoji_data' => {
            'id' => emoji.id,
            'emoji_code' => emoji.emoji_code,
            'emoji_name' => emoji.emoji_name,
            'emojiable_id' => fun_question_answer.id,
            'emojiable_type' => 'FunQuestionAnswer',
            'user_id' => user.id,
            'created_at' => emoji.created_at.strftime('%FT%T.%LZ'),
            'updated_at' => emoji.updated_at.strftime('%FT%T.%LZ')
          },
          'user' => {
            'id' => user.id,
            'email' => user.email,
            'first_name' => user.first_name,
            'last_name' => user.last_name,
            'not_ask_visibility' => user.not_ask_visibility,
            'opt_out' => user.opt_out,
            'created_at' => user.created_at.strftime('%FT%T.%LZ'),
            'updated_at' => user.updated_at.strftime('%FT%T.%LZ')
          }
        } }]
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when the emoji exists' do
      subject { delete "/api/v1/emojis/#{answer_emoji.id}", params: { id: answer_emoji.id } }
      it 'deletes the answer fun question' do
        expect { subject }.to change(Emoji, :count).by(-1)
      end

      it 'returns a Success status' do
        subject
        expect(response).to have_http_status(:success)
      end
    end
  end
end
