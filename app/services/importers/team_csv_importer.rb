class Importers::TeamCsvImporter
  DEFAULT_OPTIONS = { header_transformations: [:downcase], col_sep: ',', row_sep: :auto }.freeze

  def initialize(file, options = {})
    @file = file
    @options = DEFAULT_OPTIONS.merge(options)
  end

  def call
    return false unless @file

    begin
      csv_data = SmarterCSV.process(@file, @options)

      csv_data.each do |row|
        team_name = row[:name]
        user_emails = normalize_emails(row[:user_emails])

        user_ids = User.where(email: user_emails).ids # Get the user ids by email
        team = Team.find_or_create_by(name: team_name) # Find or create the team
        UserTeam.where(team_id: team.id).destroy_all # Remove the existing user teams

        # Add the users to the team
        UserTeam.insert_all(generate_user_teams(team.id, user_ids))
      end

      true
    rescue StandardError
      false
    end
  end

  private

  def normalize_emails(string_emails)
    return [] if string_emails.blank?

    string_emails.downcase.split(',').map(&:strip)
  end

  def generate_user_teams(team_id, user_ids)
    user_ids.map { |user_id| { team_id:, user_id: } }
  end
end
