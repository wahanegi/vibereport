require 'rails_helper'

RSpec.describe '/api/v1/emotions routes' do
  it 'routes to api/v1/emotions#index' do
    expect(get('/api/v1/emotions')).to route_to('api/v1/emotions#index')
  end
end
