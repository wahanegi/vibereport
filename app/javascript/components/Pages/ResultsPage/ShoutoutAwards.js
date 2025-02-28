import React, {Fragment} from "react";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import Pluralize from "pluralize";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";
import isEmpty from "ramda/src/isEmpty";

const ShoutoutAwards = ({timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, setShoutOutForm, currentUserShoutouts, emptyShoutouts}) => {
  return (!isEmpty(sentShoutouts) || !isEmpty(receivedShoutouts)) && <Fragment>
    <div className={`${nextTimePeriod || isEmpty(currentUserShoutouts.sent) ? 'col-2' : ''}`}></div>
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
            <div className='col p-0 minW-280' hidden={isEmpty(receivedShoutouts)}>
              {receivedShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block' key={i}>
                  <p className='fw-semibold d-inline'>
                    <span className='color-rose'> @</span><span className='fw-bold'>{shoutout.sender.first_name}</span> sent {shoutout.count} {Pluralize( 'Shoutout', shoutout.count )}&nbsp;
                  </p>
                </div>
              )}
            </div>
            <div className='col p-0 minW-280' hidden={isEmpty(sentShoutouts)}>
              {sentShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block'  key={i}>
                  <p className='fw-semibold d-inline'>
                    <span className='color-rose'>@</span><span className='fw-bold'>{shoutout.recipient.first_name}</span> got {shoutout.count} {Pluralize( 'Shoutout', shoutout.count )}&nbsp;
                  </p>
                </div>
              )}
            </div>
          </h6>
        </div>
        <img src={cup} alt="cup" style={{width: 76, height: 75}} />
      </div>
    </div>
    <div className='col-4' hidden={nextTimePeriod || isEmpty(currentUserShoutouts.sent)}>
      <div className='d-flex justify-content-center'>
        <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
        <BtnSendMoreShoutouts onClick={() => {setShoutOutForm(true)}} />
      </div>
    </div>
  </Fragment>
}

export default ShoutoutAwards
