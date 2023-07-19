import React, {Fragment, useEffect, useState} from "react";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import isEmpty from "ramda/src/isEmpty";
import Pluralize from 'pluralize';
import ShoutoutAwards from "./ShoutoutAwards";
import ShoutoutItem from "./ShoutoutItem";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";
import ShoutoutModal from "../../UI/ShoutoutModal";

const PreviewShoutoutSection = () =>
  <div className='results col'>
    <div className='row wrap shoutout preview mb-3' />
  </div>

const ShoutoutSection = ({nextTimePeriod, timePeriod, sentShoutouts, receivedShoutouts, currentUserShoutouts, data, setData, isMinUsersResponses}) => {
  const [showModal, setShowModal] = useState(false)
  const emptyCurrentUserShoutouts = isEmpty(currentUserShoutouts.received) && isEmpty(currentUserShoutouts.sent)
  const emptyShoutouts = emptyCurrentUserShoutouts && isEmpty(sentShoutouts) && isEmpty(receivedShoutouts)

  useEffect(() => {
    if (showModal) {
      window.scrollTo({top: 200, behavior: 'smooth'})
    }
  }, [showModal]);

  if(!nextTimePeriod && isMinUsersResponses) return <PreviewShoutoutSection />

  const ReceivedShoutouts = () => {
    return !isEmpty(currentUserShoutouts.received) && <div className='px-2'>
      <h5 className='text-start fw-semibold'>Received:</h5>
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
      <h5 className='text-start fw-semibold'>Sent:</h5>
      {
        currentUserShoutouts.sent.map(data => {
          const {shoutout, users} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users}} />
        })
      }
    </div>
  }

  return <Fragment>
    <div className='results col' hidden={emptyShoutouts}>
      <div className='row wrap shoutout mb-1'>
        <ShoutoutAwards {...{timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, showModal, setShowModal, currentUserShoutouts, emptyShoutouts}} />
        <div className='d-flex justify-content-start ps-2 mb-1'>
          {
            !isEmpty(currentUserShoutouts.received) && <h5 className='fw-semibold'>
              {Pluralize( 'Shoutout', currentUserShoutouts.received.length )} received: {currentUserShoutouts.received.length}
              {isEmpty(currentUserShoutouts.sent) ? '' : ';'}&nbsp;&nbsp;
            </h5>
          }
          {
            !isEmpty(currentUserShoutouts.sent) && <h5 className='fw-semibold'> {Pluralize( 'Shoutout', currentUserShoutouts.sent.length )} sent: {currentUserShoutouts.sent.length}</h5>
          }
        </div>
        <ReceivedShoutouts />
        <SentShoutouts />
      </div>
    </div>
    {
      showModal && <ShoutoutModal onClose = {() => {setShowModal(false)} }
                                  data={data} setData={setData} />

    }
  </Fragment>
}

export default ShoutoutSection
