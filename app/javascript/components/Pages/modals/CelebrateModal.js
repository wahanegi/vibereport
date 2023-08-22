import React, {Fragment} from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {apiRequest} from "../../requests/axios_requests";
import xClose from "../../../../assets/images/sys_svg/x-close.svg";

const CelebrateModal = ({ show, setShow, steps, current_user, notAskVisibility, setNotAskVisibility, saveDataToDb, goToRecognitionPage }) => {
  const handleClick = (e) => {
    setNotAskVisibility(e.target.checked);
  };
  const handleMakeVisible = () => {
    const dataSend = { not_ask_visibility: notAskVisibility }
    const dataFromServer = (current_user) => {
      saveDataToDb(steps, {current_user})
    }
    const url = '/api/v1/users/'
    const id = current_user.id
    apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then();
    goToRecognitionPage()
  };

  return <Fragment>
    <Modal show={show} onHide={() => {setShow(false)}} animation={true} className='modal-dialog-celebrate'>
      <img src={xClose} className='position-absolute x-close' onClick={() => {setShow(false)}}/>
      <Modal.Body className={'px-0 pt-3'}>
        <Form>
          <Form.Group>
            <div className='fs-4 fw-bold'>
              Including <span className='red-violet'>@</span>Shoutouts will<br/>allow other team member(s)<br/>to see your response.<br/><br/>
              <div className='fs-5 fw-bold muted'>Are you ok with that?</div>
            </div>
            <div className='d-flex justify-content-between mx-3 my-2'>
              <button className='btn btn-danger b3 border-0 shadow padding10-20' >
                No, go back
              </button>
              <button className='btn btn-primary b3 border-0 shadow padding10-20' onClick={handleMakeVisible}>
                Yes, share it
              </button>
            </div>
            <div className='d-flex justify-content-center'>
              <Form.Check label='Do not ask again' className={'muted'}
                          defaultChecked={notAskVisibility}
                          onChange={e => handleClick(e)} />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  </Fragment>
}

export default CelebrateModal
