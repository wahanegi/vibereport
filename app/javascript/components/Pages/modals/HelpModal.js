import React, {Fragment, useEffect, useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import xClose from "../../../../assets/images/sys_svg/x-close.svg";
import {isBlank} from "../../helpers/helpers";
import {Link} from "react-router-dom";
import {apiRequest} from "../../requests/axios_requests";

const HelpModal = ({ showHelpModal, setShowHelpModal, current_user, handleShowAlert }) => {
  if (isBlank(current_user)) return;
  const [details, setDetailsText] = useState('')
  const ref = useRef(null)
  const createNotification = () => {
    const dataSend = { details }
    const dataFromServer = ({callback}) => {
      if (callback === 'success') {
        handleShowAlert()
      }
    }
    const url = '/api/v1/notifications/'
    apiRequest("POST", dataSend, dataFromServer, ()=>{}, `${url}`).then();
  };

  useEffect(() => {
    ref.current && ref.current.focus()
  }, [showHelpModal])

  return <Fragment>
    <Modal size='lg' show={showHelpModal} onHide={() => {setShowHelpModal(false)}} className='modal modal-help lg'>
      <img src={xClose} className='position-absolute x-close lg' onClick={() => {setShowHelpModal(false)}}/>
      <Modal.Body>
        <div className="mb-1 px-2">
          <div className='fs-5'>
            <h4 className="modal-title">Questions or issues? Let us know!</h4>
            <h6 className="muted mb-1">Your questions and insights help make Vibe Report better!</h6>
            {
              current_user?.first_name ?
                <div>
                  <h6 className='text-start'>Your name:</h6>
                  <h5 className='text-start muted ps-1'>{current_user.first_name}</h5>
                </div> :
                null
            }
            <h6 className='text-start'>Your email address:</h6>
            <h5 className='text-start muted ps-1'>{current_user.email}</h5>
          </div>
        </div>
        <div className="help-modal-input-container mb-1 px-2">
          <h6 className='text-start mb-1'>Details:</h6>
          <form>
            <div className="form-group">
              <div className='wrap-textarea wrap-textarea-help'>
                <label className="comment-label">
                  <textarea
                    ref={ref}
                    className="form-control form-control-help"
                    value={details}
                    placeholder='We will do our best to address your concern(s).'
                    onChange={(e) => setDetailsText(e.target.value)} />
                </label>
              </div>
            </div>
          </form>
          <div className='text-center mb-1 mt-2'>
            <button className='btn btn-regular c1 border-0' disabled={!details?.trim()} onClick={createNotification}>
             Send
            </button>
          </div>
        </div>
        <div className="badge-secondary">
          <h6>Additional information about Vibe Report can be found at:</h6>
          <Link to={"#"} className='h6'>https://samplenamerealsourcehere.com</Link>
        </div>
      </Modal.Body>
    </Modal>
  </Fragment>
}

export default HelpModal
