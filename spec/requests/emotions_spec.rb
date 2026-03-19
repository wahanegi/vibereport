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
      expect(json.length).to eq(16)
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
      # Using a method instead of constant to avoid conflicts with other spec files
      def reference_date
        Date.new(2026, 3, 20)
      end

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
        # Remove all time_periods except the ones we create explicitly in this context.
        # This prevents conflicts with periods created by factory defaults or other tests.
        TimePeriod.where.not(id: [current_period.id, previous_period.id, overdue_period1.id, overdue_period2.id]).destroy_all
      end

      # Current period for reference_date (2026-03-20 Fri)
      # Week: Mon 2026-03-16 to Sun 2026-03-22
      let!(:current_period) do
        create(:time_period,
               start_date: Date.new(2026, 3, 16),
               end_date: Date.new(2026, 3, 22),
               due_date: Date.new(2026, 3, 20))
      end

      # Previous period: ends 1 week before current (for TimePeriod.previous_time_period)
      let!(:previous_period) do
        create(:time_period,
               start_date: Date.new(2026, 3, 9),
               end_date: Date.new(2026, 3, 15),
               due_date: Date.new(2026, 3, 13))
      end

      # Overdue periods for direct timesheet testing
      let!(:overdue_period1) do
        create(:time_period,
               start_date: reference_date - 30.days,
               end_date: reference_date - 25.days,
               due_date: reference_date - 22.days)
      end

      let!(:overdue_period2) do
        create(:time_period,
               start_date: reference_date - 20.days,
               end_date: reference_date - 15.days,
               due_date: reference_date - 12.days)
      end

      let(:direct_token) do
        url = TimeSheets::DirectLinkBuilder.call(user, overdue_period2)
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
            # Create response for the actual current period that API will find
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
  end
end
