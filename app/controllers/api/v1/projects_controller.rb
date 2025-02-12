class Api::V1::ProjectsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def sync
    begin
      projects_data = JSON.parse(request.body.read)['projects']
    rescue JSON::ParserError
      return render json: { error: 'Invalid JSON format' }, status: :bad_request
    end
    incoming_codes = projects_data.map { |data| data['code'].upcase.strip }
    duplicate_codes = incoming_codes.group_by(&:itself).select { |_, value| value.size > 1 }.keys

    if duplicate_codes.any?
      return render json: { error: "Duplicate codes in request: #{duplicate_codes.join(', ')}" },
                    status: :unprocessable_entity
    end

    Project.where.not(code: incoming_codes).destroy_all

    projects_data.each do |project|
      existing_project = Project.find_or_initialize_by(code: project['code'])
      existing_project.company = project['company']
      existing_project.name = project['name']
      unless existing_project.save
        return render json: { error: "Failed to save project: #{existing_project.errors.full_messages.join(', ')}" },
                      status: :unprocessable_entity
      end
    end

    render json: { message: 'Projects synchronized successfully!' }, status: :ok
  end
end
