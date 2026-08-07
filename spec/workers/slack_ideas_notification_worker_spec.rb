# frozen_string_literal: true

require 'rails_helper'

describe SlackIdeasNotificationWorker do
  let(:client) { instance_double(Slack::Client) }
  let(:digest) { instance_double(Slack::IdeasDigest) }
  let(:worker) { described_class.new(client:, digest:, channel: 'C1') }

  let(:tuesday) { Date.new(2026, 7, 28) } # ENV['DAY_TO_SEND_IDEAS_TO_SLACK'] == 'tuesday'
  let(:wednesday) { Date.new(2026, 7, 29) }

  let(:idea_a) { instance_double(InnovationBrainstorming, id: 1) }
  let(:idea_b) { instance_double(InnovationBrainstorming, id: 2) }

  def stub_postable_digest
    allow(digest).to receive(:postable?).and_return(true)
    allow(digest).to receive(:prompt).and_return('Prompt?')
    allow(digest).to receive(:ideas).and_return([idea_a, idea_b])

    allow(Slack::IdeasMessage).to receive(:parent).with(prompt: 'Prompt?')
                                                  .and_return(text: 'Prompt?', blocks: [:parent])
    allow(Slack::IdeasMessage).to receive(:idea).with(idea_a).and_return(text: 'a', blocks: [:a])
    allow(Slack::IdeasMessage).to receive(:idea).with(idea_b).and_return(text: 'b', blocks: [:b])
    allow(Slack::IdeasMessage).to receive(:reactions_for).with(idea_a).and_return(%w[thumbsup fire])
    allow(Slack::IdeasMessage).to receive(:reactions_for).with(idea_b).and_return([])
  end

  describe '#run_notification' do
    context 'when today is not the scheduled day' do
      it 'does nothing' do
        allow(Date).to receive(:current).and_return(wednesday)
        allow(digest).to receive(:postable?)

        worker.run_notification

        expect(digest).not_to have_received(:postable?)
      end

      it 'does not build a Slack client when none was injected' do
        allow(Date).to receive(:current).and_return(wednesday)
        allow(Slack::Client).to receive(:new)

        described_class.new.run_notification

        expect(Slack::Client).not_to have_received(:new)
      end
    end

    context 'when there is nothing to post' do
      it 'does not call Slack' do
        allow(Date).to receive(:current).and_return(tuesday)
        allow(digest).to receive(:postable?).and_return(false)
        allow(client).to receive(:post_message)

        worker.run_notification

        expect(client).not_to have_received(:post_message)
      end
    end

    context 'when scheduled and postable' do
      before do
        allow(Date).to receive(:current).and_return(tuesday)
        stub_postable_digest
        allow(client).to receive(:post_message).and_return('parent_ts', 'a_ts', 'b_ts')
        allow(client).to receive(:add_reaction)
      end

      it 'posts the parent card (no thread) before the ideas' do
        worker.run_notification

        expect(client).to have_received(:post_message)
          .with(channel: 'C1', blocks: [:parent], text: 'Prompt?').ordered
        expect(client).to have_received(:post_message)
          .with(channel: 'C1', blocks: [:a], text: 'a', thread_ts: 'parent_ts').ordered
      end

      it 'posts each idea as a threaded reply under the parent' do
        worker.run_notification

        expect(client).to have_received(:post_message)
          .with(channel: 'C1', blocks: [:a], text: 'a', thread_ts: 'parent_ts')
        expect(client).to have_received(:post_message)
          .with(channel: 'C1', blocks: [:b], text: 'b', thread_ts: 'parent_ts')
      end

      it 'adds the mapped reactions to each idea' do
        worker.run_notification

        expect(client).to have_received(:add_reaction).with(channel: 'C1', timestamp: 'a_ts', name: 'thumbsup')
        expect(client).to have_received(:add_reaction).with(channel: 'C1', timestamp: 'a_ts', name: 'fire')
        expect(client).to have_received(:add_reaction).twice
      end
    end

    context 'when the parent card fails to post' do
      it 'does not post any ideas' do
        allow(Date).to receive(:current).and_return(tuesday)
        stub_postable_digest
        allow(client).to receive(:post_message).and_return(nil)

        worker.run_notification

        expect(client).to have_received(:post_message).once
        expect(Slack::IdeasMessage).not_to have_received(:idea)
      end
    end

    context 'when one idea raises' do
      it 'still posts the remaining ideas' do
        allow(Date).to receive(:current).and_return(tuesday)
        stub_postable_digest
        allow(Slack::IdeasMessage).to receive(:idea).with(idea_a).and_raise('boom')
        allow(client).to receive(:post_message).and_return('parent_ts', 'b_ts')
        allow(client).to receive(:add_reaction)

        expect { worker.run_notification }.not_to raise_error

        expect(client).to have_received(:post_message)
          .with(channel: 'C1', blocks: [:b], text: 'b', thread_ts: 'parent_ts')
      end
    end
  end
end
