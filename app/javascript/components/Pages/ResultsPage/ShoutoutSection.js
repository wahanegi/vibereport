import Pluralize from 'pluralize';
import isEmpty from "ramda/src/isEmpty";
import React, {useState} from "react";
import ShoutoutModal from "../modals/ShoutoutModal";
import ShoutoutAwards from "./ShoutoutAwards";
import ShoutoutItem from "./ShoutoutItem";


const PreviewShoutoutSection = () =>
  <div className='results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12 blur-effect mb-2'>
    <div className='row wrap shoutout preview'></div>
  </div>

const ShoutoutSection = ({
                           nextTimePeriod, timePeriod, sentShoutouts, receivedShoutouts, currentUserShoutouts,
                           recivedPublicShoutouts, data, setData, isMinUsersResponses, current_user
                         }) => {
  const [shoutOutForm, setShoutOutForm] = useState(false);
  const hasCurrentUserSentShoutouts = !isEmpty(currentUserShoutouts.sent)
  const hasCurrentUserReceivedShoutouts = !isEmpty(currentUserShoutouts.received)
  const emptyCurrentUserShoutouts = !hasCurrentUserReceivedShoutouts && !hasCurrentUserSentShoutouts
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
    return hasCurrentUserSentShoutouts && <div className='px-2'>
      <h3 className='text-start fw-semibold'>Sent:</h3>
      {
        currentUserShoutouts.sent.map(data => {
          const {shoutout, users, emojis = []} = data
          return <ShoutoutItem key={shoutout.id} {...{shoutout, users, emojis, current_user}} />
        })
      }
    </div>
  }

    const CurrentUserShoutoutSent = () => hasCurrentUserSentShoutouts &&
        <h3 className='fw-semibold'> {Pluralize('Shoutout', currentUserShoutouts.sent.length)} sent: {currentUserShoutouts.sent.length}</h3>

    const CurrentUserShoutoutReceived = () => hasCurrentUserReceivedShoutouts &&
        <h3 className='fw-semibold'>
            {Pluralize('Shoutout', currentUserShoutouts.received.length)} received: {currentUserShoutouts.received.length}
            {!hasCurrentUserSentShoutouts ? '' : ';'}&nbsp;&nbsp;
        </h3>

  return <>
    <div className='results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12' hidden={emptyShoutouts}>
      <div className='row wrap shoutout mb-1 justify-content-center'>
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
            <CurrentUserShoutoutReceived />
            <CurrentUserShoutoutSent/>
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
