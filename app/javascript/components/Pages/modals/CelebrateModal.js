import React from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {apiRequest} from "../../requests/axios_requests";

const CelebrateModal = ({ show, setShow, steps, goToRecognitionPage, celebrateShoutout, setCelebrateShoutout }) => {
  const handleClick = (e) => {
    setCelebrateShoutout(Object.assign({}, celebrateShoutout, {not_ask: e.target.checked}));
  };
  const handleMakeVisible = () => {
    const dataSend = { shoutout: {visible: false} }
    const dataFromServer = (shoutout) => {
      steps.push('recognition')
      saveDataToDb(steps, {shoutout_id: shoutout.id})
    }
    const url = '/api/v1/shoutouts/'
    const id = celebrateShoutout?.id
    apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then(goToRecognitionPage);
  };

  console.log('celebrateShoutout', celebrateShoutout)
  return <Modal show={show} onHide={() => {setShow(false)}} animation={true}>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <div className='fs-5 fw-bold'>
            Including <span className='red-violet'>@</span>Shoutouts will<br/>allow other team member(s)<br/>to see your response.<br/><br/>
            <div className='fs-6 muted'>Are you ok with it?</div>
          </div>
          <div className='d-flex justify-content-between m-3'>
            <button className='btn btn-danger b3' >
              No, go back
            </button>
            <button className='btn btn-primary b3' onClick={handleMakeVisible}>
              Yes, share it
            </button>
          </div>
          <div className='d-flex justify-content-center'>
            <Form.Check label='Do not ask again' defaultChecked={celebrateShoutout.not_ask} onChange={e => handleClick(e)} />
          </div>
        </Form.Group>
      </Form>
    </Modal.Body>
  </Modal>
}

export default CelebrateModal