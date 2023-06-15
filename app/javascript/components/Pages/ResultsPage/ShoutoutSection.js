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

const NoShoutoutSent = ({nextTimePeriod, setShowModal, emptyShoutouts}) => {
  if(emptyShoutouts) return null;

  return <Fragment>
    <div className={`${nextTimePeriod ? '' : 'col-8'}`}>
      <h5 className='text-start px-1 mt-2 fw-semibold'>Sent:</h5>
      <h5 className={`muted fw-semibold mt-3 ${nextTimePeriod ? 'text-center' : 'ps-3 text-start'}`}>No Shoutouts sent for this check-in period...</h5>
    </div>
    <div className='col-4' hidden={nextTimePeriod}>
      <div className='d-flex justify-content-center mt-5'>
        <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
        <BtnSendMoreShoutouts onClick={() => {setShowModal(true)}} />
      </div>
    </div>
  </Fragment>
}

const NoShoutoutReceived = ({emptyShoutouts, currentUserShoutouts, nextTimePeriod}) => {
  if(emptyShoutouts) return null;

  return <div className='px-2'>
    <h5 className='text-start fw-semibold'>Received:</h5>
    <br/><h5 className={`muted fw-semibold ${isEmpty(currentUserShoutouts.sent) && !nextTimePeriod ? 'text-start ps-3' : 'text-center'}`}>Shoutouts sent to you appear here! </h5>
  </div>
}

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
    if(isEmpty(currentUserShoutouts.received)) return <NoShoutoutReceived emptyShoutouts={emptyShoutouts} currentUserShoutouts={currentUserShoutouts} nextTimePeriod={nextTimePeriod}/>

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
    if(isEmpty(currentUserShoutouts.sent)) return <NoShoutoutSent {...{nextTimePeriod, setShowModal, emptyShoutouts}} />
    if(isEmpty(emptyShoutouts)) return null

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
    <div className='results col'>
      <div className='row wrap shoutout mb-1'>
        <ShoutoutAwards {...{timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, showModal, setShowModal, currentUserShoutouts, emptyShoutouts}} />
        <div className='d-flex justify-content-start ps-2 mb-1'>
          {!emptyShoutouts && <Fragment>
            <h5 className='fw-semibold'>{Pluralize( 'Shoutout', currentUserShoutouts.received.length )} received: {currentUserShoutouts.received.length};</h5>&nbsp;&nbsp;
            <h5 className='fw-semibold'> {Pluralize( 'Shoutout', currentUserShoutouts.sent.length )} sent: {currentUserShoutouts.sent.length}</h5>
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