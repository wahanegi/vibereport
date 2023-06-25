import React, {Fragment, useState} from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import xClose from "../../../../assets/images/sys_svg/x-close.svg";
import {isBlank} from "../../helpers/helpers";
import {Link} from "react-router-dom";

const HelpModal = ({ show, setShow, current_user }) => {
  if (isBlank(current_user)) return;
  const [detailsText, setDetailsText] = useState('')

  return <Fragment>
    {show && <div className='backdrop' /> }
    <Modal size='lg' show={show} onHide={() => {setShow(false)}} className='modal modal-help lg'>
      <img src={xClose} className='position-absolute x-close lg' onClick={() => {setShow(false)}}/>
      <Modal.Body>
        <div className="mb-2 px-3">
          <div className='fs-5'>
            <h3 className="modal-title">Questions or issues? Let us know!</h3>
            <h6 className="muted mb-1">Your questions and insights help make Vibe report better!</h6>
            {
              current_user?.first_name ?
                <div>
                  <h6 className='text-start'>Your name:</h6>
                  <h5 className='text-start muted ps-1'>{current_user.first_name}</h5>
                </div> :
                null
            }
            <h6 className='text-start mb-1'>Your email address:</h6>
            <h5 className='text-start muted ps-1'>{current_user.email}</h5>
          </div>
        </div>
        <Form>
          <Form.Group className="text-start mb-3 px-3">
            <Form.Label className="h6">Details:</Form.Label>
            <Form.Control as="textarea" style={{minHeight: 150, borderRadius: 15}}
                          autoFocus
                          size='lg'
                          value={detailsText}
                          placeholder='We will do our best to address your concern(s)'
                          onChange={(e) => setDetailsText(e.target.value)} />
          </Form.Group>
          <div className='text-center mb-1'>
            <button className='btn btn-regular c1' disabled={!detailsText?.trim()}>
             Send
            </button>
          </div>
        </Form>
        <div className="badge-secondary">
          <h6>Additional information about Vbe Report can be found at:</h6>
          <Link to={"#"} className='h6'>https://samplenamerealsourcehere.com</Link>
        </div>
      </Modal.Body>
    </Modal>
  </Fragment>

}

export default HelpModal
