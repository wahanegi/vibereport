require 'rails_helper'

RSpec.describe EmotionsHelper, type: :helper do
  describe '#alert_questions_needed?' do
    context 'when there are unused questions' do
      it 'returns false' do
        create(:fun_question, used: false)
        expect(helper.alert_questions_needed?).to be_falsey
      end
    end

    context 'when there are no unused questions' do
      it 'returns true' do
        create(:fun_question, used: true)
        expect(helper.alert_questions_needed?).to be_truthy
      end
    end
  end
end