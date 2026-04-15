require 'rails_helper'

RSpec.describe Exporters::TimeSheetExcelExporter do
  let(:user1) { create(:user, first_name: 'Alice', last_name: 'Smith') }
  let(:user2) { create(:user, first_name: 'Bob', last_name: 'Johnson') }

  let(:project1) { create(:project, code: 'PRJ1') }
  let(:project2) { create(:project, code: 'PRJ2') }

  let(:past_period) { create(:time_period, start_date: 2.weeks.ago.to_date, end_date: 1.week.ago.to_date) }
  let(:future_period) { create(:time_period, start_date: 1.day.from_now.to_date, end_date: 1.week.from_now.to_date) }

  let!(:entry1) { create(:time_sheet_entry, project: project2, user: user2, total_hours: 5, time_period: past_period) }
  let!(:entry2) { create(:time_sheet_entry, project: project1, user: user1, total_hours: 3, time_period: past_period) }
  let!(:entry3) { create(:time_sheet_entry, project: project1, user: user2, total_hours: 4, time_period: past_period) }
  let!(:future_entry) { create(:time_sheet_entry, project: project1, user: user1, total_hours: 8, time_period: future_period) }

  let(:entries) { [entry1, entry2, entry3, future_entry] }
  subject(:exporter) { described_class.new(entries) }

  describe '#call' do
    it 'returns a non-empty binary string' do
      excel_data = exporter.call
      expect(excel_data).to be_a(String)
      expect(excel_data.size).to be > 0
    end

    it 'creates sheets only for past periods with correct names' do
      workbook_double = instance_double(Axlsx::Workbook)
      allow(Axlsx::Package).to receive(:new).and_return(double(workbook: workbook_double, to_stream: double(read: 'binary_data')))
      expect(workbook_double).to receive(:add_worksheet).with(hash_including(name: past_period.date_range.first(31)))
      expect(workbook_double).not_to receive(:add_worksheet).with(hash_including(name: future_period.date_range.first(31)))

      exporter.call
    end

    it 'adds header row and sorted data rows' do
      sheet_double = double('sheet')
      styles_double = double('styles', add_style: 1)
      allow(sheet_double).to receive(:styles).and_return(styles_double)
      allow(sheet_double).to receive(:add_row)

      workbook_double = double('workbook')
      allow(workbook_double).to receive(:add_worksheet).and_yield(sheet_double)

      allow(Axlsx::Package).to receive(:new).and_return(double(workbook: workbook_double, to_stream: double(read: 'binary_data')))

      expect(sheet_double).to receive(:add_row).with(described_class::HEADERS, style: anything).ordered
      expect(sheet_double).to receive(:add_row).with(['PRJ1', 'Alice Smith', 3]).ordered
      expect(sheet_double).to receive(:add_row).with(['PRJ1', 'Bob Johnson', 4]).ordered
      expect(sheet_double).to receive(:add_row).with(['PRJ2', 'Bob Johnson', 5]).ordered

      exporter.call
    end

    it 'limits sheet name to MAX_SHEET_NAME_LENGTH characters' do
      long_period = create(:time_period, start_date: 2.weeks.ago, end_date: 1.week.ago)
      allow(long_period).to receive(:date_range).and_return('X' * 50)

      entry_with_long_period = create(
        :time_sheet_entry,
        project: project1,
        user: user1,
        total_hours: 2,
        time_period: long_period
      )

      workbook_double = double('workbook')
      allow(Axlsx::Package).to receive(:new)
        .and_return(double(workbook: workbook_double, to_stream: double(read: 'binary_data')))

      sheet_double = double('sheet')
      styles_double = double('styles', add_style: 1)

      allow(sheet_double).to receive(:styles).and_return(styles_double)
      allow(sheet_double).to receive(:add_row)

      expect(workbook_double)
        .to receive(:add_worksheet)
        .at_least(:once) do |args|

        expect(args[:name].length)
          .to be <= described_class::MAX_SHEET_NAME_LENGTH
      end
        .and_yield(sheet_double)

      described_class.new(entries + [entry_with_long_period]).call
    end
  end
end
