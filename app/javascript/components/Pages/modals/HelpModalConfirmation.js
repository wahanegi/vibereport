import React, {Fragment} from "react";
import Modal from "react-bootstrap/Modal";
import xClose from "../../../../assets/images/sys_svg/x-close.svg";

const HelpModalConfirmation = ({ showConfirmationModal, setShowConfirmationModal }) => {
  return <Fragment>
    {showConfirmationModal && <div className='backdrop' /> }
    <Modal size='lg' show={showConfirmationModal} onHide={() => {setShowConfirmationModal(false)}} className='modal modal-help lg'>
      <img src={xClose} className='position-absolute x-close lg' onClick={() => {setShowConfirmationModal(false)}}/>
      <Modal.Body>
        <div className="mb-2 px-3">
          <div className='fs-5'>
            <h3 className="modal-title">Questions or issues? Let us know!</h3>
            <h6 className="muted mb-1">Your questions and insights help make Vibe report better!</h6>

            <h6 className='text-start mb-1'>Your email address:</h6>
            <h5 className='text-start muted ps-1'>jj</h5>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </Fragment>
}

export default HelpModalConfirmation
