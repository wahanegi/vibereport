import React, {Fragment, useState} from 'react';
import questionMark from "../../../assets/images/help.svg"
import HelpModal from "../Pages/modals/HelpModal";

const QuestionButton = ({data}) => {
  const {current_user} = data
  const [showHelpModal, setShowHelpModal] = useState(false)

  return <Fragment>
    <span onClick={() => setShowHelpModal(true)} className='placement-question-btn help-icon'>
      <img  src={questionMark} alt="Question" />
    </span>
    <HelpModal show={showHelpModal} setShow={setShowHelpModal} current_user={current_user} />
  </Fragment>
};

export default QuestionButton;