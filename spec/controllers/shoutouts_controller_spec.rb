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
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.to change(Shoutout, :count).by(1)
        expect(ShoutoutRecipient.all.length).to be(3)
      end

      it 'not allow duplicate records' do
        allow(controller).to receive(:current_user).and_return(user1)
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'Similar message',
                                              recipients: [user2.id, user3.id, user4.id] } }
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'Similar message',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.to change(Shoutout, :count).by(1)
        expect(ShoutoutRecipient.all.length).to be(3)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a shout-out with invalid time_period' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { time_period_id: nil,
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
      it 'does not create a shoutout with an unauthorized user' do
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: 'value2',
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
      it 'does not create a shout-out with absent rich_text' do
        allow(controller).to receive(:current_user).and_return(user)
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: nil,
                                              recipients: [user2.id, user3.id, user4.id] } }
        end.not_to change(Shoutout, :count)
        expect(ShoutoutRecipient.all.length).to be(0)
      end
    end

    it 'renders json answer with one recipient' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { time_period_id: time_period.id,
                                          rich_text: '<br>',
                                          recipients: [user5.id] } }
      expect(ShoutoutRecipient.all.length).to be(1)
      expect(response.body).to include_json({ time_period_id: time_period.id,
                                              rich_text: '<br>',
                                              recipients: a_collection_including(user5.id.to_s)
                                            })
    end

    it 'renders json answer with some recipients' do
      allow(controller).to receive(:current_user).and_return(user)
      post :create, params: { shoutout: { time_period_id: time_period.id,
                                          rich_text: '<br>',
                                          recipients: [user2.id, user3.id, user4.id] } }
      expect(ShoutoutRecipient.all.length).to be(3)
      expect(response.body).to include_json({ time_period_id: time_period.id,
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
                          user_id: user.id,
                          time_period_id: time_period.id,
                          rich_text: '<br>',
                          recipients: [user2.id.to_s, user3.id.to_s, user4.id.to_s],
                          digest: 1234567890 })
    end
    let!(:recipients) do
      create(:shoutout_recipient, { shoutout_id: 1, user_id: user2.id })
      create(:shoutout_recipient, { shoutout_id: 1, user_id: user3.id })
      create(:shoutout_recipient, { shoutout_id: 1, user_id: user4.id })
    end
    let!(:shoutout2) do
      create(:shoutout, { id: 2,
                          user_id: user1.id,
                          time_period_id: time_period.id,
                          rich_text: '@Person1 thanks',
                          recipients: [user5.id.to_s, user3.id.to_s, user4.id.to_s],
                          digest: digital_signature_to_prevent_duplication({ user_id: user1.id.to_s,
                                                                             time_period_id: time_period.id.to_s,
                                                                             rich_text: '@Person1 thanks',
                                                                             recipients: [user5.id.to_s, user3.id.to_s, user4.id.to_s] }) })
    end
    let!(:recipients2) do
      create(:shoutout_recipient, { shoutout_id: 2, user_id: user5.id })
      create(:shoutout_recipient, { shoutout_id: 2, user_id: user3.id })
      create(:shoutout_recipient, { shoutout_id: 2, user_id: user4.id })
    end
    context 'with valid attributes' do
      it 'updates shoutouts' do
        allow(controller).to receive(:current_user).and_return(user)
        patch :update, params: {  id: 1,
                                  shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user5.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
        expect(shoutout.shoutout_recipients.length).to eq(3)
        expect(ShoutoutRecipient.find_by(user_id: user5.id)[:user_id]).to be(user5.id)
      end
    end
    context 'with similar rich text' do
      it 'should not update when we have the similar record ' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks',
                                            recipients: [user2.id, user3.id, user4.id] } }
        expect(ShoutoutRecipient.all.length).to be(9)
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'should update shoutouts ' do
        allow(controller).to receive(:current_user).and_return(user1)
        expect do
          post :create, params: { shoutout: { time_period_id: time_period.id,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
          shoutout.reload
        end.to change(Shoutout, :count).by(1)
        expect(shoutout.shoutout_recipients.length).to eq(3)
        allow(controller).to receive(:current_user).and_return(user2)
        patch :update, params: {  id: Shoutout.last.id,
                                  shoutout: { time_period_id: time_period.id,
                                  rich_text: '@Person1',
                                  recipients: [user5.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.shoutout_recipients.length).to eq(3)
        expect(Shoutout.last.rich_text).not_to eq('@Person1 thanks')
      end
      it 'should update when we have a similar rich text but other time period' do
        allow(controller).to receive(:current_user).and_return(user)
        post :create, params: { shoutout: { time_period_id: time_period.id,
                                            rich_text: '@Person1 thanks',
                                            recipients: [user2.id, user3.id, user4.id] } }
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period1.id,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('@Person1 thanks')
      end
    end
    context 'with invalid attributes' do
      it 'without rich_text' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: time_period1.id,
                                              rich_text: nil,
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
      it 'with wrong time period' do
        patch :update, params: {  id: shoutout.id,
                                  shoutout: { time_period_id: nil,
                                              rich_text: '@Person1 thanks',
                                              recipients: [user2.id, user3.id, user4.id] } }
        shoutout.reload
        expect(shoutout.rich_text).to eq('<br>')
      end
    end
    context 'checks to calculate text digest' do
      describe '#digest_fields' do
        let(:row) do
          {
            user_id: 1,
            time_period_id: 2,
            rich_text: '@user1 @user2 some text shoutouts',
            recipients: [1, 2]
          }
        end

        it 'returns an integer digest of the input fields' do
          expected_digest = Digest::SHA1.hexdigest(row[:user_id].to_s).to_i(16) +
                            Digest::SHA1.hexdigest(row[:time_period_id].to_s).to_i(16) +
                            Digest::SHA1.hexdigest(row[:rich_text].to_s).to_i(16) +
                            Digest::SHA1.hexdigest(row[:recipients].to_s).to_i(16)
          expect(digital_signature_to_prevent_duplication(row)).to be(expected_digest.to_s.slice(0, 16).to_i)
        end
      end
    end
  end
end
