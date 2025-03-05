import Pluralize from "pluralize";
import isEmpty from "ramda/src/isEmpty";
import React, {Fragment} from "react";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";

const ShoutoutAwards = ({
                          timePeriod,
                          sentShoutouts,
                          receivedShoutouts,
                          nextTimePeriod,
                          setShoutOutForm,
                          currentUserShoutouts,
                          emptyShoutouts
                        }) => {
  return (!isEmpty(sentShoutouts) || !isEmpty(receivedShoutouts)) && <div className='row mx-auto mb-2'>
    <div className={`${nextTimePeriod || isEmpty(currentUserShoutouts.sent) ? 'col-2' : ''}`}></div>
    <div className='col-12 col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12'>
      <div className='row'>
        <div className="col-12 col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-12"><img src={cup} alt="cup" style={{width: 76, height: 75}}/></div>
        <div className="col-12 col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-12">
          <h6 className='fs-md-7 text-center fw-semibold'>
            {
              nextTimePeriod ?
                <Fragment>The Most Active Awards for {rangeFormat(timePeriod)} go to...</Fragment> :
                <Fragment>The Most Active team members are currently...</Fragment>
            }
          </h6>
          <h6 className='text-center fw-semibold row'>
            <div className='fs-md-7 col p-0 minW-280' hidden={isEmpty(receivedShoutouts)}>
              {receivedShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block' key={i}>
                  <p className='fw-semibold d-inline'>
                    <span className='color-rose'> @</span><span className='fw-bold'>{shoutout.sender.first_name}</span> sent {shoutout.count} {Pluralize('Shoutout', shoutout.count)}&nbsp;
                  </p>
                </div>
              )}
            </div>
            <div className='col p-0 minW-280' hidden={isEmpty(sentShoutouts)}>
              {sentShoutouts.slice(0, 2).map((shoutout, i) =>
                <div className='row d-inline-block' key={i}>
                  <p className='fw-semibold d-inline'>
                    <span className='color-rose'>@</span><span className='fw-bold'>{shoutout.recipient.first_name}</span> got {shoutout.count} {Pluralize('Shoutout', shoutout.count)}&nbsp;
                  </p>
                </div>
              )}
            </div>
          </h6>
        </div>
      <div className="col-12 col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-12"><img src={cup} alt="cup" style={{width: 76, height: 75}}/></div>
      </div>
    </div>
    <div className='col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12' hidden={nextTimePeriod || isEmpty(currentUserShoutouts.sent)}>
      <div className='d-flex justify-content-center flex-column mt-2 mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-2 mt-sm-2'>
        <h5 className='fs-md-7 fw-semibold'>It's not too late!</h5>
        <BtnSendMoreShoutouts onClick={() => {
          setShoutOutForm(true)
        }}/>
      </div>
    </div>
  </div>
}

export default ShoutoutAwards
