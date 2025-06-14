class Api::V1::ProjectsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    projects = Project.active.order(:name)
    render json: ProjectSerializer.new(projects).serializable_hash.to_json
  rescue StandardError => e
    Rails.logger.error "Unexpected error in ProjectsController#index: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
  end

  def sync
    projects_data = project_params[:projects]
    incoming_codes = projects_data.map { |data| data['code'].upcase.strip }
    duplicate_codes = find_duplicates_codes(incoming_codes)

    if duplicate_codes.any?
      return render json: { error: "Duplicate project codes found (#{duplicate_codes.join(', ')}). Please remove redundancies and try again." },
                    status: :unprocessable_entity
    end

    errors = sync_projects(projects_data, incoming_codes)

    return render json: { error: errors.join('; ') }, status: :unprocessable_entity if errors.any?

    render json: { message: 'Projects synchronized successfully!' }, status: :ok
  end

  private

  def project_params
    params.permit(projects: %i[company code name usage])
  end

  def find_duplicates_codes(incoming_codes)
    incoming_codes.tally.select { |_, count| count > 1 }.keys
  end

  def sync_projects(projects_data, incoming_codes)
    errors = []
    ActiveRecord::Base.transaction do
      Project.where.not(code: incoming_codes).each do |project|
        project.destroy
      end
      projects_data.each do |project_data|
        project = Project.find_or_initialize_by(code: project_data['code'])
        project.restore if project.deleted?
        unless project.update(company: project_data['company'], name: project_data['name'], usage: project_data['usage'])
          errors << "Please fill in all fields for project #{project_data['code']}: #{project.errors.full_messages.join(', ')}"
          raise ActiveRecord::Rollback
        end
      end
    end
    errors
  end
end
