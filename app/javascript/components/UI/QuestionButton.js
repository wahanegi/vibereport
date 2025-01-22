import React, { useState } from 'react';
import questionMark from "../../../assets/images/help.svg"
import HelpModal from "../Pages/modals/HelpModal";
import SweetAlertHelp from "../Pages/modals/SweetAlertHelp";

const QuestionButton = ({ data }) => {
  const { current_user } = data
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false)

  const handleShowAlert = () => {
    setShowHelpModal(false);
    setTimeout(() => { setShowConfirmationAlert(true) }, 300);
  };

  return <>
    <button onClick={() => setShowHelpModal(true)} className="hud help pointer">
      <img className="help-icon" src={questionMark} alt="Question" />
    </button>

    {showConfirmationAlert && <SweetAlertHelp setShowConfirmationAlert={setShowConfirmationAlert} />}

    <HelpModal showHelpModal={showHelpModal}
      setShowHelpModal={setShowHelpModal}
      current_user={current_user}
      handleShowAlert={handleShowAlert} />
  </>
}

export default QuestionButton;
