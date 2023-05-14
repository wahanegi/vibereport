import React from "react";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import isEmpty from "ramda/src/isEmpty";
import Pluralize from 'pluralize';
import ShoutoutAwards from "./ShoutoutAwards";
import ShoutoutItem from "./ShoutoutItem";

const PreviewShoutoutSection = () =>
  <div className='results col'>
    <div className='row wrap shoutout preview mb-3' />
  </div>

const ShoutoutSection = ({nextTimePeriod, timePeriod, sentShoutouts, receivedShoutouts, currentUserShoutouts, data, setData}) => {
  if(!nextTimePeriod && currentUserShoutouts.total_count < MIN_USERS_RESPONSES) return <PreviewShoutoutSection />
  if(isEmpty(currentUserShoutouts.received) && isEmpty(currentUserShoutouts.sent) && isEmpty(sentShoutouts) && isEmpty(receivedShoutouts)) return null

  const ReceivedShoutouts = () => {
    return !isEmpty(currentUserShoutouts.received) && <div className='px-2'>
      <h5 className='text-start fw-semibold'>Received this week:</h5>
      {
        currentUserShoutouts.received.map(data => {
          const {shoutout, users} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users}} prefix={'From '} />
        })
      }
    </div>
  }

  const SentShoutouts = () => {
    return !isEmpty(currentUserShoutouts.sent) && <div className='px-2'>
      <h5 className='text-start fw-semibold'>Sent this week:</h5>
      {
        currentUserShoutouts.sent.map(data => {
          const {shoutout, users} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users}} prefix={'To '} />
        })
      }
    </div>
  }

  return <div className='results col'>
    <div className='row wrap shoutout mb-1'>
      <ShoutoutAwards {...{timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, data, setData}} />
      <div className='d-flex justify-content-start ps-2 mb-1'>
        {!isEmpty(currentUserShoutouts.received) && <h5 className='fw-semibold'>{Pluralize( 'Shoutout', currentUserShoutouts.received.length )} received: {currentUserShoutouts.received.length};</h5>}&nbsp;
        {!isEmpty(currentUserShoutouts.sent) && <h5 className='fw-semibold'> {Pluralize( 'Shoutout', currentUserShoutouts.sent.length )} sent: {currentUserShoutouts.sent.length}</h5>}
      </div>
      <ReceivedShoutouts />
      <SentShoutouts />
    </div>
  </div>
}

export default ShoutoutSection
