# frozen_string_literal: true

# TODO: Remove this file after LEGACY_EMAIL_LINKS_CUTOFF_DATE passes.
require 'rails_helper'

RSpec.describe LegacyEmailLinkSupport, :legacy_link_support do
  subject(:obj) { Class.new { include LegacyEmailLinkSupport }.new }

  describe '#legacy_links_allowed?' do
    context 'when ENV is not set' do
      it 'returns false' do
        expect(obj.send(:legacy_links_allowed?)).to be false
      end
    end

    context 'when cutoff is today' do
      before { stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => Date.current.to_s)) }

      it 'returns true' do
        expect(obj.send(:legacy_links_allowed?)).to be true
      end
    end

    context 'when cutoff was yesterday' do
      before { stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => 1.day.ago.to_date.to_s)) }

      it 'returns false' do
        expect(obj.send(:legacy_links_allowed?)).to be false
      end
    end

    context 'when cutoff is tomorrow' do
      before { stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => 1.day.from_now.to_date.to_s)) }

      it 'returns true' do
        expect(obj.send(:legacy_links_allowed?)).to be true
      end
    end

    context 'when ENV has invalid date string' do
      before { stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => 'not-a-date')) }

      it 'returns false without raising' do
        expect(obj.send(:legacy_links_allowed?)).to be false
      end
    end
  end
end
