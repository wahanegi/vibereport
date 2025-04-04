import React, {Fragment} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useNavigate} from 'react-router-dom';
import xClose from '../../../../assets/images/sys_svg/x-close.svg';
import {updateResponse} from '../../requests/axios_requests';
import Button from '../../UI/Button';

const WorkingModal = ({show, setShow, data, setData, steps}) => {
  const navigate = useNavigate();
  const onClickNotWorking = () => {
    const index = steps.indexOf('emotion-selection-web');
    const new_steps = steps.slice(0, index + 1);

    const dataRequest = {
      response: {
        attributes: {not_working: false, draft: false, steps: new_steps},
      },
    };
    updateResponse(
      data,
      setData,
      dataRequest,
      navigate(`/${new_steps.slice(-1).toString()}`)
    ).then();
  };

  return (
    <Fragment>
      <Modal
        size="lg"
        show={show}
        onHide={() => {
          setShow(false);
        }}
        animation={true}
        centered
        dialogClassName="px-1"
      >
        <img
          src={xClose}
          className="position-absolute top-0 start-100 translate-middle x-close pointer"
          onClick={() => {
            setShow(false);
          }}
        />
        <Modal.Body>
          <div className="fs-5 fw-bold px-3 mb-2 mt-1">Just to confirm...</div>
          <div className="fs-4 fw-bold mb-2">
            Did you work during this <br/> check-in period?
            <br/>
          </div>
          <div className="fs-5 fw-bold mb-2">
            You previously indicated that you weren't
            <br/> working during this check-in period.
            <br/>
            <br/>
          </div>
          <div className="fs-5 fw-bold mb-2">
            Skip this check-in if you weren't working.
          </div>
          <div className="d-flex justify-content-lg-between">
            <div className="m-3">
              <Button
                className="btn-modal c1 bg-danger border-0 w-auto"
                onClick={() => {
                  setShow(false);
                }}
              >
                Skip check-in
              </Button>
            </div>
            <div className="m-3">
              <Button
                className="btn-modal c1 border-0 w-auto"
                onClick={onClickNotWorking}
              >
                Yes, I worked
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default WorkingModal;
