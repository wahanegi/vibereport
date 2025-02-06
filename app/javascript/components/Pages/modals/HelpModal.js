import React, {Fragment, useEffect, useRef, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {Link} from 'react-router-dom';
import xClose from '../../../../assets/images/sys_svg/x-close.svg';
import {isBlank} from '../../helpers/helpers';
import {apiRequest} from '../../requests/axios_requests';

const HelpModal = ({
                     showHelpModal,
                     setShowHelpModal,
                     current_user,
                     handleShowAlert,
                   }) => {
  if (isBlank(current_user)) return;
  const [details, setDetailsText] = useState('');
  const ref = useRef(null);
  const createNotification = () => {
    const dataSend = {details};
    const dataFromServer = ({callback}) => {
      if (callback === 'success') {
        handleShowAlert();
      }
    };
    const url = '/api/v1/notifications/';
    apiRequest('POST', dataSend, dataFromServer, () => {
    }, `${url}`).then();
  };

  useEffect(() => {
    ref.current && ref.current.focus();
  }, [showHelpModal]);

  return (
    <Fragment>
      <Modal
        size="lg"
        show={showHelpModal}
        onHide={() => {
          setShowHelpModal(false);
        }}
        centered
        dialogClassName="px-1"
      >
        <img
          src={xClose}
          className="position-absolute top-0 start-100 translate-middle pointer"
          onClick={() => {
            setShowHelpModal(false);
          }}
        />
        <Modal.Body>
          <div className="mb-1 px-0 px-sm-2">
            <h4 className="modal-title fs-5 fs-md-3">Questions or issues? Let us know!</h4>
            <h6 className="text-gray-600 mb-1 fs-7 fs-md-6">
              Your questions and insights help make Vibe Report better!
            </h6>
            {current_user?.first_name ? (
              <div>
                <h6 className="text-start fs-7 fs-md-6">Your name:</h6>
                <h5 className="text-start text-gray-600 ps-1 fs-7 fs-md-4">
                  {current_user.first_name}
                </h5>
              </div>
            ) : null}
            <h6 className="text-start fs-7 fs-md-6">Your email address:</h6>
            <h5 className="text-start text-gray-600 ps-1 fs-7 fs-md-4">
              {current_user.email}
            </h5>
          </div>
          <div className="mb-1 px-0 px-sm-2">
            <h6 className="text-start mb-1 fs-7 fs-md-6">Details:</h6>
            <div className="w-100 border border-3 rounded rounded-4 border-royal-blue p-1">
              <form>
                <textarea
                  ref={ref}
                  className="help-modal-textarea w-100 border-0 p-1 rounded-0 shadow-none textarea-resize-none x-close"
                  value={details}
                  placeholder="We will do our best to address your concern(s)."
                  onChange={(e) => setDetailsText(e.target.value)}
                />
              </form>
            </div>

            <div className="text-center mb-1 mt-2">
              <button
                className="btn btn-regular btn-lg c1 border-0"
                disabled={!details?.trim()}
                onClick={createNotification}
              >
                Send
              </button>
            </div>
          </div>
          <div className="bg-light-gray border-light-gray border border-4 rounded rounded-4">
            <h6>Additional information about Vibe Report can be found at:</h6>
            <Link to={'#'} className="fs-9 fs-sm-7 fs-md-6 text-decoration-none">
              https://samplenamerealsourcehere.com
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default HelpModal;
