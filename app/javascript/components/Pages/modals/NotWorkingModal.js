import React, {Fragment} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../../UI/Button";
import {isBlank, rangeFormat} from "../../helpers/helpers";

const NotWorkingModal = ({ data, makeNotWorking, show, setShow }) => {
  const {response, time_period} = data
  if (isBlank(time_period) || isBlank(response.attributes.id)) return null;

  const onClickNotWorking = () => {
    makeNotWorking()
  }

  return <Fragment>
    <Modal size='lg' show={show} onHide={() => {setShow(false)}} animation={true} className='modal modal-help lg padding-placement'>
      <Modal.Body>
        <div className='fs-4 fw-bold px-3 mb-2 mt-1'>
          Just to confirm...
        </div>
        <div className='h5 fw-bold muted'>
          We noticed that you’ve already submitted responses <br/> for this check-in - {rangeFormat(time_period)}.<br/><br/>
          Proceeding will delete previous responses and direct <br/> you to the Results page.
        </div>
        <div className='column'>
          <div className='row my-2'>
            <Button className='btn-modal c1 back border-0 w-auto' onClick={() => {setShow(false)}}>No, go back</Button>
          </div>
          <div className='row mb-2'>
            <Button className='btn-modal c1 delete border-0 w-auto' onClick={onClickNotWorking}> I was not working, delete</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </Fragment>
}

export default NotWorkingModal
