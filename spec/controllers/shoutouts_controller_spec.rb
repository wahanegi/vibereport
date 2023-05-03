require 'rails_helper'
require 'rspec/json_expectations'

RSpec.describe Api::V1::ShoutoutsController, type: :controller do
  include ApplicationHelper
  let!(:user) { create :user }
  let!(:user1) { create :user }
  let!(:time_period) { create :time_period }
  describe 'POST #create' do
    context 'with valid parameters' do
      it 'creates a new shout-out' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'value2',
                                              recipients: [2, 3, 4] } }
        end.to change(Shoutout, :count).by(1)
      end

      it 'not allow duplicate records' do
        allow(controller).to receive(:current_user).and_return(user1)
        expect do
          post :create, params: { shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'Similar message',
                                              recipients: [2, 3, 4] } }
          post :create, params: { shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'Similar message',
                                              recipients: [2, 3, 4] } }
        end.to change(Shoutout, :count).by(1)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a shout-out' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: nil,
                                              rich_text: 'value2',
                                              recipients: [2, 3, 4] } }
        end.not_to change(Shoutout, :count)
        expect do
          post :create, params: { shoutout: { user_id: nil,
                                              time_period_id: time_period[:id],
                                              rich_text: 'value2',
                                              recipients: [2, 3, 4] } }
        end.not_to change(Shoutout, :count)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: nil,
                                              recipients: [2, 3, 4] } }
        end.not_to change(Shoutout, :count)
      end
    end

    it 'renders json answer with one recipient' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { user_id: user[:id],
                                          time_period_id: time_period[:id],
                                          rich_text: '<br>',
                                          recipients: [5] } }
      expect(response.body).to include_json({
                                              user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '<br>',
                                              recipients: a_collection_including('5')
                                            })
    end

    it 'renders json answer with some recipients' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { user_id: user[:id],
                                          time_period_id: time_period[:id],
                                          rich_text: '<br>',
                                          recipients: [2, 3, 4] } }
      expect(response.body).to include_json({
                                              user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '<br>',
                                              recipients: a_collection_including('2', '3', '4')
                                            })
    end
  end
  describe 'PATCH #update' do
    let!(:user) { create :user, opt_out: false }
    let!(:user1) { create :user, opt_out: false }
    let!(:time_period) { create :time_period }
    let!(:time_period1) { create :time_period }
    let!(:shoutout) do
      create(:shoutout, { id: 1,
                          user_id: user[:id],
                          time_period_id: time_period[:id],
                          rich_text: '<br>',
                          recipients: [2, 3, 4],
                          digest: 1234567890})
    end
    let!(:shoutout2) do
      create(:shoutout, { id: 2,
                          user_id: user1[:id],
                          time_period_id: time_period[:id],
                          rich_text: '@Person1 thanks',
                          recipients: ["2", "3", "4"],
                          digest: digest_fields({user_id: user1[:id].to_s,
                                                 time_period_id: time_period[:id].to_s,
                                                 rich_text: '@Person1 thanks',
                                                 recipients: ["2", "3", "4"]})})
    end
    context 'with valid attributes' do
      it 'updates shoutouts' do
        allow(controller).to receive(:current_user).and_return(user)
        patch :update, params: {  id: 1,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
      end
    end
    context 'with similar rich text' do
      it 'should not update when we have the similar record ' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { user_id: user[:id],
                                            time_period_id: time_period[:id],
                                            rich_text: '@Person1 thanks',
                                            recipients: [2, 3, 4] } }
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'should update when we have a similar rich text but other user and
          should not update when we have the similar rich text in the same user' do
        allow(controller).to receive(:current_user).and_return(user1)
        expect do
          post :create, params: { shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1',
                                              recipients: [2, 3, 4] } }
          shoutout.reload
        end.to change(Shoutout, :count).by(1)
        patch :update, params: {  id: Shoutout.last[:id],
                                  shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(Shoutout.all.length).to be(3)
        expect(Shoutout.last.rich_text).not_to eq('@Person1 thanks')
      end
      it 'should update when we have a similar rich text but other time period' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { user_id: user[:id],
                                            time_period_id: time_period[:id],
                                            rich_text: '@Person1 thanks',
                                            recipients: [2, 3, 4] } }
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period1[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
      end
    end
    context "with invalid attributes" do
      it 'with wrong user' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: nil,
                                              time_period_id: time_period1[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'with wrong time period' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: nil,
                                              rich_text: '@Person1 thanks',
                                              recipients: [2, 3, 4] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
    end
  end
end
