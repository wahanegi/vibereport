import React from "react";
import SweetAlert from "../../UI/SweetAlert";

const SweetAlertHelp = ({setShowConfirmationAlert}) => {
  const alertTitle = "<div class='mt-1 fs-4 fw-bold text-black'>Thanks for reaching out!</div>"
  const alertHtml = 'Look out for a follow-up message in</br> your inbox.'

  return <SweetAlert
    onConfirmAction={() => {setShowConfirmationAlert(false)}}
    onDeclineAction={() => {setShowConfirmationAlert(false)}}
    alertTitle={alertTitle}
    alertHtml={alertHtml}
    denyButtonText={'Back to check-in'}
    showConfirmButton={false}
    showDenyButton={true}
    showCancelButton={false} />
}

export default SweetAlertHelp