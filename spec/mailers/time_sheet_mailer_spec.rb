require 'rails_helper'

RSpec.describe TimeSheetMailer, type: :mailer do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:time_period) { create(:time_period) }
  let(:project1) { create(:project) }
  let(:project2) { create(:project) }
  let(:entry1) { create(:time_sheet_entry, project: project1, user: user1, total_hours: 5, time_period: time_period) }
  let(:entry2) { create(:time_sheet_entry, project: project1, user: user2, total_hours: 3, time_period: time_period) }
  let(:entry3) { create(:time_sheet_entry, project: project2, user: user1, total_hours: 7, time_period: time_period) }

  let(:grouped_entries) { [entry1, entry2, entry3].group_by(&:project) }
  let(:mail) { TimeSheetMailer.time_sheet_results_email(grouped_entries, time_period) }

  before do
    allow(ENV).to receive(:fetch).with('TIMESHEETS_RESULTS_EMAILS', '').and_return('test1@example.com, test2@example.com')
    allow(ENV).to receive(:fetch).with('TIMESHEETS_DOC_LOCATION', nil).and_return('https://docs.google.com/spreadsheets/d/example')
  end

  it 'sends the email to the correct recipients' do
    expect(mail.to).to eq(['test1@example.com', 'test2@example.com'])
  end

  it 'has the correct subject' do
    expect(mail.subject).to eq("Timesheet Entries for #{time_period.date_range_str}")
  end

  it 'contains the correct date range' do
    expect(mail.body.encoded).to include(time_period.date_range_str)
  end

  it 'contains the correct project code and total hours' do
    expect(mail.body.encoded).to include(project1.code)
    expect(mail.body.encoded).to include(project2.code)
    expect(mail.body.encoded).to include('Total 8 hours')
    expect(mail.body.encoded).to include('Total 7 hours')
  end

  it 'contains the timesheet document link' do
    expect(mail.body.encoded).to include('https://docs.google.com/spreadsheets/d/example')
  end

  it 'includes the CSV attachment with correct content' do
    file = mail.attachments.first
    expected_csv_body = Exporters::TimeSheetCsvExporter.new(grouped_entries).call

    expect(file.filename).to eq("Timesheet Entries #{time_period.date_range_str} #{time_period.start_date.year}.csv")
    expect(file.content_type).to start_with('text/csv')
    expect(file.body.raw_source.gsub("\r\n", "\n")).to eq(expected_csv_body)
  end
end
