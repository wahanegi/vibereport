require 'rails_helper'

RSpec.describe TimeSheetMailer, type: :mailer do
  let(:user1) { create(:user, first_name: 'Alice', last_name: 'Smith') }
  let(:user2) { create(:user, first_name: 'Bob', last_name: 'Johnson') }
  let(:time_period) { create(:time_period) }
  let(:project1) { create(:project, code: 'PRJ1') }
  let(:project2) { create(:project, code: 'PRJ2') }

  let(:entry1) { create(:time_sheet_entry, project: project1, user: user1, total_hours: 5, time_period: time_period) }
  let(:entry2) { create(:time_sheet_entry, project: project1, user: user2, total_hours: 3, time_period: time_period) }
  let(:entry3) { create(:time_sheet_entry, project: project2, user: user1, total_hours: 7, time_period: time_period) }

  let(:entries) { [entry1, entry2, entry3] }
  let(:grouped_entries) { entries.group_by(&:project) }
  let(:mail) { TimeSheetMailer.time_sheet_results_email(entries, grouped_entries, time_period) }

  before do
    allow(ENV).to receive(:fetch).with('TIMESHEETS_RESULTS_EMAILS', '').and_return('test1@example.com,test2@example.com')
    allow(ENV).to receive(:fetch).with('TIMESHEETS_DOC_LOCATION', nil).and_return('https://docs.google.com/spreadsheets/d/example')
  end

  it 'sends the email to the correct recipients' do
    expect(mail.to).to eq(['test1@example.com', 'test2@example.com'])
  end

  it 'has the correct subject' do
    expect(mail.subject).to eq("Timesheet Entries #{Time.zone.today.strftime(DateFormats::DAY_MONTH_YEAR)}")
  end

  it 'contains the correct date range' do
    expect(mail.body.encoded).to include(time_period.date_range)
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

  it 'attaches an Excel file' do
    expect(mail.attachments.count).to eq(1)
    file = mail.attachments.first
    expect(file.filename).to eq("Timesheet Entries #{Time.zone.today.strftime(DateFormats::DAY_MONTH_YEAR)}.xlsx")
    expect(file.content_type).to eq(TimeSheetMailer::EXCEL_MIME_TYPE)
  end
end
