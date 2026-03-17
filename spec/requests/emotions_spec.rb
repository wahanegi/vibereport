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

    it 'should returns a proper format of the JSON response' do
      get '/api/v1/emotions'
      expect(json.length).to eq(18)
      expect(json[:time_period][:id]).to eq(TimePeriod.current.id)
      expect(json[:time_period][:start_date]).to eq(TimePeriod.current.start_date.to_s)
      expect(json[:time_period][:end_date]).to eq(TimePeriod.current.end_date.to_s)
      expected = json_data.first
      expect(expected[:id]).not_to eq(emotion.id.to_s)
      expect(expected[:type]).to eq('emotion')
    end

    it 'should will be correct the length of the response' do
      get '/api/v1/emotions'
      expect(json_data.length).to eq(24)
    end

    it 'should will be correct the length of a nested arrays' do
      get '/api/v1/emotions'
      expect(json_data.first[:attributes].length).to eq(2)
      expect(count_word_in_obj('positive', json)).to eq(12)
      expect(count_word_in_obj('negative', json)).to eq(12)
    end

    context 'direct timesheet mode' do
      include ActiveSupport::Testing::TimeHelpers

      # Friday – inside default check-in window (Fri–Mon)
      REFERENCE_DATE = Date.new(2026, 3, 20)

      let!(:team) { create(:team, timesheet_enabled: true) }
      let!(:user_team) { create(:user_team, user: user, team: team, created_at: REFERENCE_DATE - 2.months) }
      let!(:project) { create(:project) }

      before do
        stub_const('ENV', ENV.to_hash.merge(
                            'TIMESHEET_START_FORCED_ENTRY_DATE' => (REFERENCE_DATE - 30.days).strftime('%Y-%m-%d'),
                            'DAY_TO_SEND_INVITES' => 'friday',
                            'DAY_TO_SEND_FINAL_REMINDER' => 'monday',
                            'START_WEEK_DAY' => 'monday'
                          ))
      end

      let!(:overdue_period1) do
        create(:time_period,
               start_date: REFERENCE_DATE - 30.days,
               end_date: REFERENCE_DATE - 25.days,
               due_date: REFERENCE_DATE - 22.days)
      end

      let!(:overdue_period2) do
        create(:time_period,
               start_date: REFERENCE_DATE - 20.days,
               end_date: REFERENCE_DATE - 15.days,
               due_date: REFERENCE_DATE - 12.days)
      end

      # Period whose end_date is 1 week before current week (so previous_time_period finds it)
      # For REFERENCE_DATE 2026-03-20 (Fri), current week ends 2026-03-22, previous ends 2026-03-15
      let!(:previous_period) do
        create(:time_period,
               start_date: Date.new(2026, 3, 9),
               end_date: Date.new(2026, 3, 15),
               due_date: Date.new(2026, 3, 13))
      end

      let(:direct_token) do
        url = TimeSheets::DirectLinkBuilder.call(user, overdue_period2)
        Rack::Utils.parse_query(URI.parse(url).query)['token']
      end

      def setup_direct_session
        get '/api/v1/direct_timesheet_entry', params: { token: direct_token }
        follow_redirect!
      end

      context 'has_remaining_direct_timesheets' do
        it 'is true when another overdue period has no timesheet' do
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:has_remaining_direct_timesheets]).to be true
          end
        end

        it 'is false when all other overdue periods have timesheet entries' do
          create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
          create(:time_sheet_entry, user: user, project: project, time_period: previous_period, total_hours: 8)
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
          end
          expect(json[:has_remaining_direct_timesheets]).to be false
        end

        it 'is false when direct mode is off' do
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:has_remaining_direct_timesheets]).to be false
          end
        end
      end

      context 'can_complete_check_in' do
        it 'is true when in check-in window and no completed response for previous period (even with remaining timesheets)' do
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:has_remaining_direct_timesheets]).to be true
            expect(json[:can_complete_check_in]).to be true
          end
        end

        it 'is true when no remaining timesheets, in check-in window, no completed response' do
          create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
          create(:time_sheet_entry, user: user, project: project, time_period: previous_period, total_hours: 8)
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:can_complete_check_in]).to be true
          end
        end

        it 'is false when user has completed response for previous period' do
          create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
          create(:time_sheet_entry, user: user, project: project, time_period: previous_period, total_hours: 8)
          create(:response, user: user, time_period: previous_period, draft: false)
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:can_complete_check_in]).to be false
          end
        end

        it 'is false when outside check-in window (Tuesday)' do
          create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
          create(:time_sheet_entry, user: user, project: project, time_period: previous_period, total_hours: 8)
          setup_direct_session
          travel_to(Date.new(2026, 3, 24)) do # Tuesday
            get '/api/v1/emotions'
            expect(json[:can_complete_check_in]).to be false
          end
        end
      end

      context 'direct_results_path' do
        it 'returns /results/:slug when all timesheets done and previous period exists' do
          create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
          create(:time_sheet_entry, user: user, project: project, time_period: previous_period, total_hours: 8)
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:direct_results_path]).to eq("/results/#{previous_period.slug}")
          end
        end

        it 'is nil when remaining direct timesheets exist' do
          setup_direct_session
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:direct_results_path]).to be_nil
          end
        end

        it 'is nil when direct mode is off' do
          travel_to(REFERENCE_DATE) do
            get '/api/v1/emotions'
            expect(json[:direct_results_path]).to be_nil
          end
        end
      end

      it 'memoizes previous_time_period_for_check_in' do
        create(:time_sheet_entry, user: user, project: project, time_period: overdue_period1, total_hours: 8)
        setup_direct_session

        allow(TimePeriod).to receive(:previous_time_period).and_call_original

        travel_to(REFERENCE_DATE) do
          get '/api/v1/emotions'
        end

        expect(TimePeriod).to have_received(:previous_time_period).at_most(:once)
      end
    end
  end
end
