import React, {Fragment, useState} from 'react';
import questionMark from "../../../assets/images/help.svg"
import HelpModal from "../Pages/modals/HelpModal";
import SweetAlertHelp from "../Pages/modals/SweetAlertHelp";

const QuestionButton = ({data}) => {
  const {current_user} = data
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false)

  const handleShowAlert = () => {
    setShowHelpModal(false);
    setTimeout(() => {setShowConfirmationAlert(true)}, 300);
  };

  return <Fragment>
    <span onClick={() => setShowHelpModal(true)} className={'hud help pointer'}>
      <img  src={questionMark} alt="Question" />
    </span>
    {showConfirmationAlert && <SweetAlertHelp setShowConfirmationAlert={setShowConfirmationAlert}/>}
    <HelpModal showHelpModal={showHelpModal} setShowHelpModal={setShowHelpModal} current_user={current_user} handleShowAlert={handleShowAlert} />
  </Fragment>
};

export default QuestionButton;
