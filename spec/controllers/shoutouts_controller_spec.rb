require 'rails_helper'
require 'rspec/json_expectations'

RSpec.describe Api::V1::ShoutoutsController, type: :controller do
  include ApplicationHelper
  let!(:user) { create :user }
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:user3) { create :user }
  let!(:user4) { create :user }
  let!(:user5) { create :user }
  let!(:time_period) { create :time_period }
  describe 'POST #create' do
    context 'with valid parameters' do
      it 'creates a new shout-out with recipients of this shoutout' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.to change(Shoutout, :count).by(1)
        expect(RecipientShoutout.all.length).to be(3)
      end

      it 'not allow duplicate records' do
        allow(controller).to receive(:current_user).and_return(user1)
        expect do
          post :create, params: { shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'Similar message',
                                              recipients: [user2.id, user3.id, user4.id] } }
          post :create, params: { shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: 'Similar message',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.to change(Shoutout, :count).by(1)
        expect(RecipientShoutout.all.length).to be(3)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a shout-out' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: nil,
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(RecipientShoutout.all.length).to be(0)
        expect do
          post :create, params: { shoutout: { user_id: nil,
                                              time_period_id: time_period[:id],
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(RecipientShoutout.all.length).to be(0)
        expect do
          post :create, params: { shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: nil,
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(RecipientShoutout.all.length).to be(0)
      end
    end

    it 'renders json answer with one recipient' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { user_id: user[:id],
                                          time_period_id: time_period[:id],
                                          rich_text: '<br>',
                                          recipients: [user5.id] } }
      expect(RecipientShoutout.all.length).to be(1)
      expect(response.body).to include_json({
                                              user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '<br>',
                                              recipients: a_collection_including(user5.id.to_s)
                                            })
    end

    it 'renders json answer with some recipients' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { user_id: user[:id],
                                          time_period_id: time_period[:id],
                                          rich_text: '<br>',
                                          recipients: [user2.id, user3.id, user4.id] } }
      expect(RecipientShoutout.all.length).to be(3)
      expect(response.body).to include_json({
                                              user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '<br>',
                                              recipients: a_collection_including(user2.id.to_s, user3.id.to_s, user4.id.to_s)
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
                          recipients: [user2.id.to_s, user3.id.to_s, user4.id.to_s],
                          digest: 1234567890 })
    end
    let!(:recipients) do
      create(:recipient_shoutout, { shoutout_id: 1, user_id: user2[:id] })
      create(:recipient_shoutout, { shoutout_id: 1, user_id: user3[:id] })
      create(:recipient_shoutout, { shoutout_id: 1, user_id: user4[:id] })
    end
    let!(:shoutout2) do
      create(:shoutout, { id: 2,
                          user_id: user1[:id],
                          time_period_id: time_period[:id],
                          rich_text: '@Person1 thanks',
                          recipients: [user5.id.to_s, user3.id.to_s, user4.id.to_s],
                          digest: digest_fields({ user_id: user1[:id].to_s,
                                                 time_period_id: time_period[:id].to_s,
                                                 rich_text: '@Person1 thanks',
                                                 recipients: [user5.id.to_s, user3.id.to_s, user4.id.to_s] }) })
    end
    let!(:recipients2) do
      create(:recipient_shoutout, { shoutout_id: 2, user_id: user5[:id] })
      create(:recipient_shoutout, { shoutout_id: 2, user_id: user3[:id] })
      create(:recipient_shoutout, { shoutout_id: 2, user_id: user4[:id] })
    end
    context 'with valid attributes' do
      it 'updates shoutouts' do
        allow(controller).to receive(:current_user).and_return(user)
        patch :update, params: {  id: 1,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user5.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
        expect(RecipientShoutout.all.length).to be(6)
        expect(RecipientShoutout.find_by(user_id: user5.id)[:user_id]).to be(user5.id)
      end
    end
    context 'with similar rich text' do
      it 'should not update when we have the similar record ' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { user_id: user[:id],
                                            time_period_id: time_period[:id],
                                            rich_text: '@Person1 thanks',
                                            recipients: [user2.id, user3.id, user4.id] } }
        expect(RecipientShoutout.all.length).to be(9)
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
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
                                              recipients: [user2.id, user3.id, user4.id] } }
          shoutout.reload
        end.to change(Shoutout, :count).by(1)
        expect(RecipientShoutout.all.length).to be(9)
        patch :update, params: {  id: Shoutout.last[:id],
                                  shoutout: { user_id: user1[:id],
                                              time_period_id: time_period[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [user5.id, user3.id, user4.id] } }
        shoutout.reload
        expect(Shoutout.all.length).to be(3)
        expect(Shoutout.last.rich_text).not_to eq('@Person1 thanks')
      end
      it 'should update when we have a similar rich text but other time period' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { user_id: user[:id],
                                            time_period_id: time_period[:id],
                                            rich_text: '@Person1 thanks',
                                            recipients: [user2.id, user3.id, user4.id] } }
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: time_period1[:id],
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
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
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'with wrong time period' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { user_id: user[:id],
                                              time_period_id: nil,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
    end
  end
end
