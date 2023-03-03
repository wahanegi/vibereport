require 'rails_helper'

RSpec.describe '/api/v1/responses routes' do
  it 'routes to api/v1/responses#index' do
    expect(get('/api/v1/responses')).to route_to('api/v1/responses#index')
  end
end
