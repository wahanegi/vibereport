import React, {Fragment} from "react";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import Pluralize from "pluralize";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";
import isEmpty from "ramda/src/isEmpty";

const NoShoutouts = ({nextTimePeriod, setShowModal}) =>
  <Fragment>
    <div className={`${nextTimePeriod ? '' : 'col-8'}`}>
      {
        nextTimePeriod ?
          <h5 className='text-center muted fw-semibold mt-3'>No Shoutouts sent during this check-in.</h5>:
          <h5 className='text-center muted fw-semibold mt-3'>No Shoutouts yet for this check-in...</h5>
      }
    </div>
    <div className='col-4' hidden={nextTimePeriod}>
      <div className='d-flex justify-content-center'>
        <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
        <BtnSendMoreShoutouts onClick={() => {setShowModal(true)}} />
      </div>
    </div>
  </Fragment>

const ShoutoutAwards = ({timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, setShowModal, currentUserShoutouts, emptyShoutouts}) => {
  if (emptyShoutouts) return <NoShoutouts nextTimePeriod={nextTimePeriod} setShowModal={setShowModal} />

  return (!isEmpty(sentShoutouts) || !isEmpty(receivedShoutouts)) && <Fragment>
    <div className={`${nextTimePeriod || (isEmpty(currentUserShoutouts.sent) && !isEmpty(currentUserShoutouts.received)) ? 'col-2' : ''}`}></div>
    <div className='col-8'>
      <div className='d-flex flex-nowrap'>
        <img src={cup} alt="cup" style={{width: 76, height: 75}} />
        <div>
          <h6 className='text-center fw-semibold'>
            {
              nextTimePeriod ?
                <Fragment>The Most Active Awards for {rangeFormat(timePeriod)} go to...</Fragment>:
                <Fragment>The Most Active team members are currently...</Fragment>
            }
          </h6>
          <h6 className='text-center fw-semibold row'>
            <div className='col p-0' hidden={isEmpty(sentShoutouts)}>
              {sentShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block'>
                  <p className='fw-semibold d-inline' key={i}>
                    <span className='color-rose'>@</span>{shoutout.recipient.first_name} sent {shoutout.count} {Pluralize( 'Shoutout', shoutout.count )}
                  </p>
                </div>
              )}
            </div>
            <div className='col p-0' hidden={isEmpty(receivedShoutouts)}>
              {receivedShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block'>
                  <p className='fw-semibold d-inline' key={i}>
                    <span className='color-rose'> @</span>{shoutout.sender.first_name} got {shoutout.count} {Pluralize( 'Shoutout', shoutout.count )}
                  </p>
                </div>
              )}
            </div>
          </h6>
        </div>
        <img src={cup} alt="cup" style={{width: 76, height: 75}} />
      </div>
    </div>
    <div className='col-4' hidden={nextTimePeriod || (isEmpty(currentUserShoutouts.sent) && !isEmpty(currentUserShoutouts.received)) }>
      <div className='d-flex justify-content-center'>
        <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
        <BtnSendMoreShoutouts onClick={() => {setShowModal(true)}} />
      </div>
    </div>
  </Fragment>
}

export default ShoutoutAwards
