import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { isEmpty } from '../../helpers/helpers';
import { apiRequest } from '../../requests/axios_requests';
import xClose from '../../../../assets/images/sys_svg/x-close.svg';
import RichInputElement from '../../UI/rich-text/RichInputElement';

const ShoutoutModalNew = ({
  shoutOutForm,
  setShoutOutForm,
  data,
  setData: setDataInDB,
  editObj = {},
}) => {
  const [richText, setRichText] = useState(
    isEmpty(editObj) ? '' : editObj.rich_text
  );
  const idEditText = isEmpty(editObj) ? null : editObj.id;
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandling = ({ richText, chosenUsers, isPublic }) => {
    const dataSend = {
      shoutout: {
        user_id: data.current_user_id,
        time_period_id: data.time_period.id,
        rich_text: richText,
        public: isPublic,
      },
      recipients: chosenUsers.map((user) => user.id),
    };
    const dataFromServer = (createdUpdatedShoutOut) => {
      let currentShoutOuts = data.user_shoutouts;

      if (idEditText) {
        currentShoutOuts = currentShoutOuts.filter(
          (item) => item.id !== idEditText
        );
      }

      setDataInDB({
        ...data,
        user_shoutouts: [...currentShoutOuts, createdUpdatedShoutOut],
      });

      setShoutOutForm(false);
    };

    setRichText(richText);

    idEditText === null
      ? apiRequest(
          'POST',
          dataSend,
          dataFromServer,
          () => {},
          '/api/v1/shoutouts'
        ).catch(handlingErrors)
      : apiRequest(
          'PATCH',
          dataSend,
          dataFromServer,
          () => {},
          '/api/v1/shoutouts/' + idEditText
        ).catch(handlingErrors);
  };

  const handlingErrors = (errors) => {
    if (errors.response.data.error.rich_text?.length) {
      setErrorMessage(errors.response.data.error.rich_text[0]);
      setIsNotAlert(false);
    }
  };
  return (
    <>
      <Modal
        size="lg"
        show={shoutOutForm}
        onHide={() => {
          setShoutOutForm(false);
        }}
        centered
        dialogClassName="px-1 custom-modal"
      >
        <img
          src={xClose}
          className="position-absolute top-0 start-100 translate-middle x-close"
          onClick={() => {
            setShoutOutForm(false);
          }}
        />
        <Modal.Body>
          <RichInputElement
            richText={richText}
            listUsers={data.users.filter(
              (user) => user.id !== data.current_user.id
            )}
            onSubmit={submitHandling}
            editObj={editObj}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShoutoutModalNew;
