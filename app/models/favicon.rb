# == Schema Information
#
# Table name: logos
#
#  id         :bigint           not null, primary key
#  type       :string           default("Logo")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Favicon < Logo
end
