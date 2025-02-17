# Preview all emails at http://localhost:3000/rails/mailers/time_sheet_mailer
class TimeSheetMailerPreview < ActionMailer::Preview
  def time_sheet_results_email
    time_period = TimePeriod.previous_time_period
    time_sheet_entries = time_period.time_sheet_entries
    grouped_entries = group_and_sort_entries(time_sheet_entries)
    TimeSheetMailer.time_sheet_results_email(grouped_entries, time_period)
  end

  private

  def group_and_sort_entries(entries)
    entries.group_by(&:project).sort_by { |project, _| project.code }
  end
end
