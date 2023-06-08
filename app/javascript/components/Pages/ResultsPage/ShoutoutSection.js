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

const NoShoutoutSent = ({nextTimePeriod, setShowModal}) =>
  <Fragment>
    <div className={`${nextTimePeriod ? '' : 'col-8'}`}>
      <h5 className='text-center muted fw-semibold mt-3'>No Shoutouts sent for this check-in period...</h5>
    </div>
    <div className='col-4' hidden={nextTimePeriod}>
      <div className='d-flex justify-content-center'>
        <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
        <BtnSendMoreShoutouts onClick={() => {setShowModal(true)}} />
      </div>
    </div>
  </Fragment>

const NoShoutoutReceived = () =>
  <div className='px-2'>
    <h5 className='text-start fw-semibold'>Received:</h5>
    <br/><h5 className='text-center muted fw-semibold'>Shoutouts sent to you appear here! </h5>
  </div>

const ShoutoutSection = ({nextTimePeriod, timePeriod, sentShoutouts, receivedShoutouts, currentUserShoutouts, data, setData}) => {
  const [showModal, setShowModal] = useState(false)
  const emptyShoutouts = isEmpty(sentShoutouts) && isEmpty(receivedShoutouts) && isEmpty(currentUserShoutouts.received) && isEmpty(currentUserShoutouts.sent)

  useEffect(() => {
    if (showModal) {
      window.scrollTo({top: 200, behavior: 'smooth'})
    }
  }, [showModal]);

  if(!nextTimePeriod && currentUserShoutouts.total_count < MIN_USERS_RESPONSES) return <PreviewShoutoutSection />

  const ReceivedShoutouts = () => {
    if(!isEmpty(currentUserShoutouts.sent) && isEmpty(currentUserShoutouts.received)) return <NoShoutoutReceived />

    return !isEmpty(currentUserShoutouts.received) && <div className='px-2'>
      <h5 className='text-start'>Received:</h5>
      {
        currentUserShoutouts.received.map(data => {
          const {shoutout, users} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users}} prefix={'From '} />
        })
      }
    </div>
  }

  const SentShoutouts = () => {
    if(!isEmpty(currentUserShoutouts.received) && isEmpty(currentUserShoutouts.sent)) return <NoShoutoutSent {...{nextTimePeriod, setShowModal}} />

    return !isEmpty(currentUserShoutouts.sent) && <div className='px-2'>
      <h5 className='text-start'>Sent:</h5>
      {
        currentUserShoutouts.sent.map(data => {
          const {shoutout, users} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users}} />
        })
      }
    </div>
  }

  return <Fragment>
    <div className='results col'>
      <div className='row wrap shoutout mb-1'>
        <ShoutoutAwards {...{timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, showModal, setShowModal, currentUserShoutouts, emptyShoutouts}} />
        <div className='d-flex justify-content-start ps-2 mb-1'>
          {!emptyShoutouts && <Fragment>
            <h5>{Pluralize( 'Shoutout', currentUserShoutouts.received.length )} received: {currentUserShoutouts.received.length};</h5>&nbsp;&nbsp;
            <h5> {Pluralize( 'Shoutout', currentUserShoutouts.sent.length )} sent: {currentUserShoutouts.sent.length}</h5>
          </Fragment>}
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
