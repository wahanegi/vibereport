import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import questionMark from "../../../assets/images/help.svg"
import HelpModal from "../Pages/modals/HelpModal";
import HelpModalConfirmation from "../Pages/modals/HelpModalConfirmation";

const QuestionButton = ({data}) => {
  const {current_user} = data
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleShowConfirmationModal = () => {
    setShowHelpModal(false);
    setShowConfirmationModal(true);
  };

  return <Fragment>
    <span onClick={() => setShowHelpModal(true)} className='placement-question-btn help-icon'>
      <img  src={questionMark} alt="Question" />
    </span>
    <HelpModal showHelpModal={showHelpModal} setShowHelpModal={setShowHelpModal} current_user={current_user} handleShowConfirmationModal={handleShowConfirmationModal} />
    <HelpModalConfirmation showConfirmationModal={showConfirmationModal} setShowConfirmationModal={setShowConfirmationModal} />
  </Fragment>
};

export default QuestionButton;