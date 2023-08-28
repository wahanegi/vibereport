require 'rails_helper'

RSpec.describe MigrateShoutoutsWorker do
  describe '#process' do
    let!(:celebrate_shoutouts) { create_list(:celebrate_shoutout, 3) }

    before do
      allow_any_instance_of(CelebrateShoutout).to receive(:update!)
      allow_any_instance_of(MigrateShoutoutsWorker).to receive(:mention_to_rich_text).and_return('<span>Updated text</span>')
    end

    it 'updates celebrate shoutouts and prints success message' do
      worker = described_class.new

      expect(worker).to receive(:update_celebrate_shoutouts!).and_call_original
      expect(worker.process).to eq("Successfully updated #{celebrate_shoutouts.count} CelebrateShoutouts!")
    end

    it 'rescues and prints error message on StandardError' do
      worker = described_class.new

      allow(worker).to receive(:update_celebrate_shoutouts!).and_raise(StandardError.new('Something went wrong'))

      expect(worker.process).to eq("Error: Something went wrong!")
    end
  end
end