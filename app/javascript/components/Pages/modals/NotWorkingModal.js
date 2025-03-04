import React, { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '../../UI/Button';
import { isBlank, rangeFormat } from '../../helpers/helpers';

const NotWorkingModal = ({ data, makeNotWorking, show, setShow }) => {
  const { response, time_period } = data;
  if (isBlank(time_period) || isBlank(response.attributes.id)) return null;

  const onClickNotWorking = () => {
    makeNotWorking();
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
        <Modal.Body>
          <div className="fs-4 fw-bold px-3 mb-2 mt-1">Just to confirm...</div>
          <div className="fs-6 fw-bold text-gray-600">
            We noticed that you’ve already submitted responses <br /> for this
            check-in - {rangeFormat(time_period)}.<br />
            <br />
            Proceeding will delete previous responses and direct <br /> you to
            the Results page.
          </div>
          <div className="d-flex flex-column">
            <div className="m-2">
              <Button
                className="btn-modal fs-5 fs-md-3 fw-bold bg-gray-200 bg-gray-hover-200 border-0 w-auto"
                onClick={() => {
                  setShow(false);
                }}
              >
                No, go back
              </Button>
            </div>
            <div className="m-2">
              <Button
                className="btn-modal lh-1 fs-5 fs-md-3 fw-bold bg-danger border-0 w-auto"
                onClick={onClickNotWorking}
              >
                {' '}
                I was not working, delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default NotWorkingModal;
