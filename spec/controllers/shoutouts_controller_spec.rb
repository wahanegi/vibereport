require 'rails_helper'
require 'rspec/json_expectations'

RSpec.describe Api::V1::ShoutoutsController, type: :controller do
  let!(:user) { create :user }
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:user3) { create :user }
  let!(:user4) { create :user }
  let!(:user5) { create :user }
  let!(:time_period) { create :time_period }

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      it 'creates a new shout-out with recipients of this shoutout' do
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'value2' },
                                  recipients: [user2.id, user3.id, user4.id] }
        end.to change(Shoutout, :count).by(1)
        expect(ShoutoutRecipient.all.length).to be(3)
      end

      it 'not allow duplicate records' do
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'Similar message', public: true },
                                  recipients: [user2.id, user3.id, user4.id] }
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'Similar message', public: false },
                                  recipients: [user2.id, user3.id, user4.id] }
        end.to change(Shoutout, :count).by(1)
        expect(ShoutoutRecipient.all.length).to be(3)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a shout-out with invalid time_period' do
        expect do
          post :create, params: { shoutout: { time_period_id: nil,
                                              rich_text: 'value2' },
                                  recipients: [user2.id, user3.id, user4.id]  }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
      it 'does not create a shoutout with an unauthorized user', logged_out: true do
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'value2' },
                                  recipients: [user2.id, user3.id, user4.id] }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
      it 'does not create a shout-out with absent rich_text' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: nil },
                                  recipients: [user2.id, user3.id, user4.id] }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
    end

    it 'renders json answer with one recipient' do
      post :create, params: { shoutout: { time_period_id: time_period.id,
                                          rich_text: '<br>' },
                              recipients: [user5.id] }
      expect(ShoutoutRecipient.all.length).to be(1)
      expect(response.body).to include_json({ time_period_id: time_period.id,
                                              rich_text: '<br>' })
    end

    it 'renders json answer with some recipients' do
      post :create, params: { shoutout: { time_period_id: time_period.id,
                                          rich_text: '<br>' },
                              recipients: [user2.id, user3.id, user4.id] }
      expect(ShoutoutRecipient.all.length).to be(3)
      expect(response.body).to include_json({ time_period_id: time_period.id, rich_text: '<br>' },
                                            recipients: a_collection_including(user2.id.to_s, user3.id.to_s, user4.id.to_s))
    end
  end
  describe 'PATCH #update' do
    let!(:user) { create :user }
    let!(:user1) { create :user }
    let!(:user2) { create :user }
    let!(:user3) { create :user }
    let!(:user4) { create :user }
    let!(:user5) { create :user }
    let!(:time_period) { create :time_period }
    let!(:time_period1) { create :time_period }
    let!(:shoutout) do
      create(:shoutout, { user_id: user.id,
                          time_period_id: time_period.id,
                          rich_text: '<br>' })
    end
    let!(:shoutout_recipient) do
      create(:shoutout_recipient, { user_id: user2.id, shoutout_id: shoutout.id })
      create(:shoutout_recipient, { user_id: user3.id, shoutout_id: shoutout.id })
      create(:shoutout_recipient, { user_id: user4.id, shoutout_id: shoutout.id })
    end
    let!(:shoutout2) do
      create(:shoutout, { user_id: user1.id,
                          time_period_id: time_period.id,
                          rich_text: '@Person1 thanks' })
    end
    let!(:shoutout_recipient2) do
      create(:shoutout_recipient, { shoutout_id: shoutout2.id, user_id: user5.id })
      create(:shoutout_recipient, { shoutout_id: shoutout2.id, user_id: user3.id })
      create(:shoutout_recipient, { shoutout_id: shoutout2.id, user_id: user4.id })
    end
    context 'with valid attributes' do
      it 'updates shoutouts' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1 thanks for all' },
                                  recipients: [user2.id, user3.id, user5.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks for all')
        expect(shoutout.shoutout_recipients.count).to eq(3)
        expect(shoutout.shoutout_recipients.last.user_id).to eq(user5.id)
      end
    end
    context 'with similar rich text' do
      it 'should not update when we have the similar record ' do
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks' },
                                recipients: [user2.id, user3.id, user4.id] }
        expect(shoutout.shoutout_recipients.length).to be(3)
        patch :update, params: { id: shoutout.id,
                                 shoutout: { time_period_id: time_period.id,
                                             rich_text: '@Person1 thanks' },
                                 recipients: [user2.id, user3.id, user4.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'should not update when we have the similar record and public ' do
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks',
                                            public: true },
                                recipients: [user2.id, user3.id, user4.id] }
        expect(shoutout.shoutout_recipients.length).to be(3)
        patch :update, params: { id: shoutout.id,
                                 shoutout: { time_period_id: time_period.id,
                                             rich_text: '@Person1 thanks',
                                             public: true },
                                 recipients: [user2.id, user3.id, user4.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'should update when we have the similar record, but another public ' do
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks',
                                            public: true },
                                recipients: [user2.id, user3.id, user4.id] }
        expect(shoutout.shoutout_recipients.length).to be(3)
        patch :update, params: { id: shoutout.id,
                                 shoutout: { time_period_id: time_period.id,
                                             rich_text: '@Person1 thanks',
                                             public: false },
                                 recipients: [user2.id, user3.id, user4.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
        expect(shoutout.public).to eq(false)
        expect(shoutout.shoutout_recipients.length).to eq(3)
      end
      it 'should update shoutouts ' do
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1 thank you very much' },
                                  recipients: [user2.id, user3.id, user4.id] }
          shoutout.reload
        end.to change(Shoutout, :count).by(1)
        expect(shoutout.shoutout_recipients.length).to eq(3)
        allow(controller).to receive(:current_user).and_return(user2)
        patch :update, params: {  id: Shoutout.last.id,
                                  shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1' },
                                  recipients: [user5.id, user3.id, user4.id]  }
        shoutout.reload
        expect(shoutout.shoutout_recipients.length).to eq(3)
        expect(Shoutout.last.rich_text).not_to eq('@Person1 thanks')
      end
      it 'should update when we have a similar rich text but other time period' do
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks' },
                                recipients: [user2.id, user3.id, user4.id] }
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period1.id,
                                              rich_text: '@Person1 thanks' },
                                  recipients: [user2.id, user3.id, user4.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
      end
    end
    context 'with invalid attributes' do
      it 'without rich_text' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period1.id,
                                              rich_text: nil },
                                  recipients: [user2.id, user3.id, user4.id]  }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'with wrong time period' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: nil,
                                              rich_text: '@Person1 thanks' },
                                  recipients: [user2.id, user3.id, user4.id] }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
    end
  end
end
