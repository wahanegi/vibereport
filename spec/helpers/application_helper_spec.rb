# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe '#check_in_period?' do
    include ActiveSupport::Testing::TimeHelpers

    FRI = Date.new(2026, 3, 20)
    SAT = Date.new(2026, 3, 21)
    SUN = Date.new(2026, 3, 22)
    MON = Date.new(2026, 3, 23)
    TUE = Date.new(2026, 3, 24)
    WED = Date.new(2026, 3, 25)
    THU = Date.new(2026, 3, 26)

    context 'with default window Fri -> Mon' do
      before do
        stub_const('ENV', ENV.to_hash.except('DAY_TO_SEND_INVITES', 'DAY_TO_SEND_FINAL_REMINDER'))
      end

      it 'returns true on Friday' do
        travel_to(FRI) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns true on Saturday' do
        travel_to(SAT) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns true on Sunday' do
        travel_to(SUN) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns true on Monday' do
        travel_to(MON) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns false on Tuesday' do
        travel_to(TUE) { expect(helper.send(:check_in_period?)).to be false }
      end

      it 'returns false on Wednesday' do
        travel_to(WED) { expect(helper.send(:check_in_period?)).to be false }
      end

      it 'returns false on Thursday' do
        travel_to(THU) { expect(helper.send(:check_in_period?)).to be false }
      end
    end

    context 'with non-wrap window Wed -> Fri' do
      before do
        stub_const('ENV', ENV.to_hash.merge(
                            'DAY_TO_SEND_INVITES' => 'wednesday',
                            'DAY_TO_SEND_FINAL_REMINDER' => 'friday'
                          ))
      end

      it 'returns true on Wednesday' do
        travel_to(WED) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns true on Thursday' do
        travel_to(THU) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns true on Friday' do
        travel_to(FRI) { expect(helper.send(:check_in_period?)).to be true }
      end

      it 'returns false on Tuesday' do
        travel_to(TUE) { expect(helper.send(:check_in_period?)).to be false }
      end

      it 'returns false on Saturday' do
        travel_to(SAT) { expect(helper.send(:check_in_period?)).to be false }
      end

      it 'returns false on Monday' do
        travel_to(MON) { expect(helper.send(:check_in_period?)).to be false }
      end
    end

    context 'with invalid DAY_TO_SEND_INVITES' do
      before do
        stub_const('ENV', ENV.to_hash.merge('DAY_TO_SEND_INVITES' => 'notaday'))
      end

      it 'raises error' do
        expect { helper.send(:check_in_period?) }.to raise_error(RuntimeError, 'Invalid DAY_TO_SEND_INVITES: Notaday')
      end
    end

    context 'with invalid DAY_TO_SEND_FINAL_REMINDER' do
      before do
        stub_const('ENV', ENV.to_hash.merge(
                            'DAY_TO_SEND_INVITES' => 'friday',
                            'DAY_TO_SEND_FINAL_REMINDER' => 'notaday'
                          ))
      end

      it 'raises error' do
        expect { helper.send(:check_in_period?) }.to raise_error(RuntimeError, 'Invalid DAY_TO_SEND_FINAL_REMINDER: Notaday')
      end
    end
  end
end
