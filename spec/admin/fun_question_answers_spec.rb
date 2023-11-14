require 'rails_helper'

RSpec.describe 'Admin::FunQuestionAnswers', type: :request do
  let!(:admin_user) { create(:admin_user) }
  let!(:fun_question) { create(:fun_question) }
  let!(:fun_question_answers) { create_list(:fun_question_answer, 5, fun_question:) }

  before do
    sign_in admin_user
  end

  describe 'Export CSV' do
    it 'exports fun question answers as CSV' do
      get export_csv_admin_fun_question_fun_question_answers_path(fun_question_id: fun_question.id, format: :csv)

      expect(response.content_type).to include('text/csv')
      expect(response.headers['Content-Disposition']).to include('attachment; filename=fun_question_answers.csv')

      csv_content = CSV.parse(response.body, headers: true)
      expect(csv_content.headers).to eq(['Question', 'User Name', 'Answer'])

      fun_question_answers.each do |answer|
        expect(csv_content.to_s).to include(answer.fun_question.question_body)
        expect(csv_content.to_s).to include(answer.user.first_name)
        expect(csv_content.to_s).to include(answer.user.last_name)
        expect(csv_content.to_s).to include(answer.answer_body)
      end
    end
  end
end
