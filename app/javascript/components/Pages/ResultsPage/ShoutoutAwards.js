import React, {Fragment, useEffect, useState} from "react";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import Pluralize from "pluralize";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";
import ShoutoutModal from "../../UI/ShoutoutModal";

const ShoutoutAwards = ({timePeriod, sentShoutouts, receivedShoutouts, nextTimePeriod, data, setData}) => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById('overlays');
      if (modalElement) {
        modalElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showModal]);

  if (sentShoutouts.length < 2 || receivedShoutouts.length < 2) return null

  return <Fragment>
    <div className={`${nextTimePeriod ? '' : 'col-8'}`}>
      <div className='d-flex flex-nowrap'>
        <img src={cup} alt="cup" style={{width: 76, height: 75}} />
        <div>
          <h6 className='w-auto text-center fw-semibold'>
            {
              nextTimePeriod ?
                <Fragment>The most Active Award for {rangeFormat(timePeriod)} goes to...</Fragment>:
                <Fragment>The most Active team members are currently...</Fragment>
            }
          </h6>
          <h6 className='w-auto text-center fw-semibold'>
            {sentShoutouts.slice(0, 2).map((shoutout, i) =>
              <div className='row' key={i}>
                <p className='fw-semibold'>
                  <span className='color-rose'>@</span>{receivedShoutouts[i].sender.first_name} sent {receivedShoutouts[i].count} {Pluralize( 'Shoutout', receivedShoutouts[i].count )}
                  <span className='color-rose'> @</span>{shoutout.recipient.first_name} got {shoutout.count} {Pluralize( 'Shoutout', shoutout.count )}
                </p>
              </div>
            )}
          </h6>
        </div>
        <img src={cup} alt="cup" style={{width: 76, height: 75}} />
      </div>
    </div>
    <div className='col-4' hidden={nextTimePeriod}>
      <h6 className='mb-0 fw-semibold'>It's not too late!</h6>
      <BtnSendMoreShoutouts onClick={() => {setShowModal(true)}} />
    </div>
    {
      showModal && <ShoutoutModal onClose = {() => {setShowModal(false)} }
                                  data={data} setData={setData} />

    }
  </Fragment>
}

export default ShoutoutAwards
