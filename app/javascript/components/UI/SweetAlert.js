import React from 'react';
import Swal from "sweetalert2";

const SweetAlert = ({onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText, cancelButtonClass, backdropClass}) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary ms-5 fs-5',
      cancelButton: `btn fs-5 ${cancelButtonClass || 'btn-danger'}`,
      closeButton: 'swal2-close-button',
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: alertTitle,
    html: alertHtml,
    showCancelButton: true,
    showCloseButton: true,
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
    reverseButtons: true,
    backdrop:  'rgba(166, 161, 161, 85%)',
  }).then((result) => {
    if (result.isConfirmed) {
      return onConfirmAction()
    } {
      onDeclineAction()
    }
  })
}

export default SweetAlert
