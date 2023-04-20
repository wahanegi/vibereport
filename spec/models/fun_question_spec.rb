# == Schema Information
#
# Table name: fun_questions
#
#  id            :bigint           not null, primary key
#  public        :boolean          default(FALSE), not null
#  question_body :text
#  used          :boolean          default(FALSE), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  response_id   :bigint
#  user_id       :bigint
#
# Indexes
#
#  index_fun_questions_on_response_id  (response_id)
#  index_fun_questions_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (response_id => responses.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe FunQuestion, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
