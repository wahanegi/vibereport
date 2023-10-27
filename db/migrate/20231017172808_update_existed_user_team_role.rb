class UpdateExistedUserTeamRole < ActiveRecord::Migration[7.0]
  def up
    UserTeam.where(manager: true).update_all(role: :manager)
  end
end
