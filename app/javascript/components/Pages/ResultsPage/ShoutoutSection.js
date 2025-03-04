import Pluralize from 'pluralize';
import isEmpty from "ramda/src/isEmpty";
import React, {useState} from "react";
import ShoutoutModal from "../modals/ShoutoutModal";
import ShoutoutAwards from "./ShoutoutAwards";
import ShoutoutItem from "./ShoutoutItem";


const PreviewShoutoutSection = () =>
  <div className='results container blur-effect'>
    <div className='row wrap shoutout preview'></div>
  </div>

const ShoutoutSection = ({
                           nextTimePeriod, timePeriod, sentShoutouts, receivedShoutouts, currentUserShoutouts,
                           recivedPublicShoutouts, data, setData, isMinUsersResponses, current_user
                         }) => {
  const [shoutOutForm, setShoutOutForm] = useState(false);
  const emptyCurrentUserShoutouts = isEmpty(currentUserShoutouts.received) && isEmpty(currentUserShoutouts.sent)
  const emptyShoutouts = emptyCurrentUserShoutouts && isEmpty(sentShoutouts) && isEmpty(receivedShoutouts)

  if (!nextTimePeriod && isMinUsersResponses) return <PreviewShoutoutSection/>

  const ReceivedShoutouts = () => {
    return !isEmpty(recivedPublicShoutouts) && <div className='px-2'>
      {
        recivedPublicShoutouts.map(data => {
          const {shoutout, users, emojis = []} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users, emojis, current_user}} prefix={'From '}/>
        })
      }
    </div>
  }

  const SentShoutouts = () => {
    return !isEmpty(currentUserShoutouts.sent) && <div className='px-2'>
      <h5 className='fs-md-5 text-start fw-semibold'>Sent:</h5>
      {
        currentUserShoutouts.sent.map(data => {
          const {shoutout, users, emojis = []} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users, emojis, current_user}} />
        })
      }
    </div>
  }

  return <>
    <div className='results container' hidden={emptyShoutouts}>
      <div className='row wrap shoutout mb-1'>
        <ShoutoutAwards {...{
          timePeriod,
          sentShoutouts,
          receivedShoutouts,
          nextTimePeriod,
          shoutOutForm,
          setShoutOutForm,
          currentUserShoutouts,
          emptyShoutouts
        }} />
        <div className='d-flex justify-content-start ps-2 mb-1'>
          {
            !isEmpty(currentUserShoutouts.received) && <h4 className='fw-semibold'>
              {Pluralize('Shoutout', currentUserShoutouts.received.length)} received: {currentUserShoutouts.received.length}
              {isEmpty(currentUserShoutouts.sent) ? '' : ';'}&nbsp;&nbsp;
            </h4>
          }
          {
            !isEmpty(currentUserShoutouts.sent) &&
            <h5 className='fs-md-5 fw-semibold'> {Pluralize('Shoutout', currentUserShoutouts.sent.length)} sent: {currentUserShoutouts.sent.length}</h5>
          }
        </div>
        <ReceivedShoutouts/>
        <SentShoutouts/>
      </div>
    </div>
    {
      shoutOutForm && <ShoutoutModal shoutOutForm={shoutOutForm}
                                     setShoutOutForm={setShoutOutForm}
                                     data={data}
                                     setData={setData}/>
    }
  </>
}

export default ShoutoutSection
