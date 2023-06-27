import React, {Fragment} from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {apiRequest} from "../../requests/axios_requests";
import xClose from "../../../../assets/images/sys_svg/x-close.svg";

const CelebrateModal = ({ show, setShow, steps, celebrateShoutout, setCelebrateShoutout, saveDataToDb, goToRecognitionPage }) => {
  const handleClick = (e) => {
    setCelebrateShoutout(Object.assign({}, celebrateShoutout, {not_ask: e.target.checked}));
  };
  const handleMakeVisible = () => {
    const dataSend = { shoutout: {visible: true, not_ask: celebrateShoutout.not_ask} }
    const dataFromServer = (shoutout) => {
      saveDataToDb(steps, {shoutout_id: shoutout.id})
    }
    const url = '/api/v1/shoutouts/'
    const id = celebrateShoutout?.id
    apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then();
    goToRecognitionPage()
  };

  return <Fragment>
    {show && <div className='backdrop celebrate-modal' /> }
    <Modal show={show} onHide={() => {setShow(false)}} animation={true} className='modal-dialog-celebrate'>
      <img src={xClose} className='position-absolute x-close' onClick={() => {setShow(false)}}/>
      <Modal.Body>
        <Form>
          <Form.Group>
            <div className='fs-4 fw-bold'>
              Including <span className='red-violet'>@</span>Shoutouts will<br/>allow other team member(s)<br/>to see your response.<br/><br/>
              <div className='fs-6 muted'>Are you ok with that?</div>
            </div>
            <div className='d-flex justify-content-between mx-3 my-2'>
              <button className='btn btn-danger b3 border-0 shadow' >
                No, go back
              </button>
              <button className='btn btn-primary b3 border-0 shadow' onClick={handleMakeVisible}>
                Yes, share it
              </button>
            </div>
            <div className='d-flex justify-content-center'>
              <Form.Check label='Do not ask again' className={'muted'}
                          defaultChecked={celebrateShoutout.not_ask}
                          onChange={e => handleClick(e)} />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  </Fragment>

}

export default CelebrateModal
