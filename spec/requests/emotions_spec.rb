require 'rails_helper'

RSpec.describe Api::V1::EmotionsController do
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:user) { create :user }
  let!(:emotion) { create(:emotion, category: 'positive', public: true) }
  let!(:emotion_positive) { create_list(:emotion, 12) }
  let!(:emotion_negative) { create_list(:emotion, 12, :negative) }

  before(:each) do
    sign_in(user)
  end

  describe '#index' do
    it 'should returns a success response' do
      get '/api/v1/emotions'
      expect(response).to have_http_status(:success)
    end

    it 'returns JSON with required keys and time_period' do
      get '/api/v1/emotions'
      expect(json).to have_key(:innovation_topic)
      expect(json).to have_key(:time_period)
      expect(json[:time_period][:id]).to eq(TimePeriod.current.id)
      expect(json[:time_period][:start_date]).to eq(TimePeriod.current.start_date.to_s)
      expect(json[:time_period][:end_date]).to eq(TimePeriod.current.end_date.to_s)
      expected = json_data.first
      expect(expected[:id]).to be_present
      expect(expected[:type]).to eq('emotion')
      expect(expected[:attributes].length).to eq(2)
    end

    it 'returns emotions data as an array with both categories' do
      get '/api/v1/emotions'
      expect(json_data).to be_an(Array)
      expect(json_data).not_to be_empty
      expect(json_data.first[:attributes]).to include(:word, :category)
    end

    context 'innovation_topic' do
      it 'returns topic pre-assigned to current period and sets posted on first request' do
        current_period = TimePeriod.find_or_create_time_period
        topic = create(:innovation_topic, posted: false, time_period: current_period, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_present
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(json[:innovation_topic][:innovation_body]).to eq(topic.innovation_body)
        expect(json[:innovation_topic][:time_period_id]).to eq(current_period.id)
        expect(topic.reload.posted).to eq(true)
      end

      it 'returns same topic on second request without updating posted again' do
        current_period = TimePeriod.find_or_create_time_period
        topic = create(:innovation_topic, posted: true, time_period: current_period, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(topic.reload.posted).to eq(true)
      end

      it 'returns nil when no topic assigned to current period' do
        create(:innovation_topic, posted: true, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_nil
      end

      it 'includes innovation_topic when an unposed topic exists and marks it as posted' do
        topic = create(:innovation_topic, posted: false, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_present
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(json[:innovation_topic][:innovation_body]).to eq(topic.innovation_body)
        expect(json[:innovation_topic][:time_period_id]).to eq(TimePeriod.find_or_create_time_period.id)
        expect(topic.reload.posted).to eq(true)
        expect(topic.reload.time_period_id).to eq(TimePeriod.find_or_create_time_period.id)
      end

      it 'returns the same innovation_topic on subsequent requests when already assigned to period' do
        topic = create(:innovation_topic, posted: false, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        first_id = json[:innovation_topic][:id]
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(first_id)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
      end

      it 'assigns the eligible innovation topic with the lowest sort_order when several exist' do
        first_topic = create(
          :innovation_topic,
          posted: false,
          time_period_id: nil,
          user: user,
          innovation_body: 'FIFO deterministic topic alpha',
          sort_order: 10
        )
        second_topic = create(
          :innovation_topic,
          posted: false,
          time_period_id: nil,
          user: user,
          innovation_body: 'FIFO deterministic topic beta',
          sort_order: 20
        )

        get '/api/v1/emotions'

        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(first_topic.id)
        expect(InnovationTopic.find(first_topic.id).time_period_id).to eq(TimePeriod.find_or_create_time_period.id)
        expect(InnovationTopic.find(second_topic.id).time_period_id).to be_nil
      end

    end

    context 'direct timesheet mode' do
      let(:reference_date) { Date.new(2026, 3, 20) }

      let!(:team) { create(:team, timesheet_enabled: true) }
      let!(:user_team) { create(:user_team, user: user, team: team, created_at: reference_date - 2.months) }
      let!(:project) { create(:project) }

      around do |example|
        original_values = {
          'TIMESHEET_START_FORCED_ENTRY_DATE' => ENV.fetch('TIMESHEET_START_FORCED_ENTRY_DATE', nil),
          'DAY_TO_SEND_INVITES' => ENV.fetch('DAY_TO_SEND_INVITES', nil),
          'DAY_TO_SEND_FINAL_REMINDER' => ENV.fetch('DAY_TO_SEND_FINAL_REMINDER', nil),
          'START_WEEK_DAY' => ENV.fetch('START_WEEK_DAY', nil)
        }
        ENV['TIMESHEET_START_FORCED_ENTRY_DATE'] = (reference_date - 30.days).strftime('%Y-%m-%d')
        ENV['DAY_TO_SEND_INVITES'] = 'friday'
        ENV['DAY_TO_SEND_FINAL_REMINDER'] = 'monday'
        ENV['START_WEEK_DAY'] = 'monday'
        example.run
      ensure
        original_values.each { |k, v| v.nil? ? ENV.delete(k) : ENV[k] = v }
      end

      before do
        TimePeriod.where.not(id: [current_period.id, overdue_period2.id]).destroy_all
      end

      let!(:current_period) do
        create(:time_period,
               start_date: Date.new(2026, 3, 16),
               end_date: Date.new(2026, 3, 22),
               due_date: Date.new(2026, 3, 20))
      end

      let!(:overdue_period2) do
        create(:time_period,
               start_date: reference_date - 20.days,
               end_date: reference_date - 15.days,
               due_date: reference_date - 12.days)
      end

      let(:direct_token) do
        url = SignedLinks::DirectTimesheetEntryBuilder.call(user, overdue_period2)
        Rack::Utils.parse_query(URI.parse(url).query)['token']
      end

      def setup_direct_session
        get '/api/v1/direct_timesheet_entry', params: { token: direct_token }
        follow_redirect!
      end

      context 'can_complete_check_in' do
        it 'is true when in check-in window and no completed response for current period' do
          travel_to(reference_date) do
            setup_direct_session
            get '/api/v1/emotions'

            expect(json[:can_complete_check_in]).to be true
          end
        end

        it 'is false when user has completed response for current period' do
          travel_to(reference_date) do
            actual_current = TimePeriod.current || TimePeriod.find_or_create_time_period
            create(:response, user: user, time_period: actual_current, draft: false)

            setup_direct_session
            get '/api/v1/emotions'

            expect(json[:can_complete_check_in]).to be false
          end
        end

        it 'is false when outside check-in window (Tuesday)' do
          travel_to(Date.new(2026, 3, 24)) do # Tuesday
            setup_direct_session
            get '/api/v1/emotions'

            expect(json[:can_complete_check_in]).to be false
          end
        end

        it 'is false when direct mode is off' do
          travel_to(reference_date) do
            get '/api/v1/emotions'

            expect(json[:can_complete_check_in]).to be false
          end
        end
      end
    end


    context 'when there are no eligible fun questions' do
      before do
        # No custom question for the current period
        FunQuestion.where(time_period_id: TimePeriod.find_or_create_time_period.id).delete_all

        # No fallback custom question (not_used + user_id present)
        FunQuestion.delete_all
        create(:fun_question, public: false, used: false) # not eligible (not public)
        create(:fun_question, public: true, used: true)   # not eligible (already used)
      end

      it 'returns 200 and fun_question as nil without errors' do
        expect { get '/api/v1/emotions' }.not_to raise_error

        expect(response).to have_http_status(:ok)
        expect(json).to have_key(:fun_question)
        expect(json[:fun_question]).to be_nil
      end
    end
  end
end
