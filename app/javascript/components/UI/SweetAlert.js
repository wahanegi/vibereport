import React from 'react';
import Swal from "sweetalert2";

const SweetAlert = ({onConfirmAction = () => {}, onDeclineAction = () => {}, alertTitle, alertHtml, cancelButtonText, confirmButtonText,
                      cancelButtonClass, confirmButtonClass, denyButtonText, showCloseButton = true,
                      showDenyButton = false, showCancelButton = true, showConfirmButton = true}) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: `btn fs-5 ${confirmButtonClass || 'btn-primary'}`,
      cancelButton: `btn fs-5 ${cancelButtonClass || 'btn-danger'}`,
      denyButton: `btn btn-regular btn-lg c1 bg-gray-200 bg-gray-hover-200 border-0 mb-2`,
      closeButton: 'swal2-close-button',
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: alertTitle,
    html: alertHtml,
    showCancelButton: showCancelButton,
    showCloseButton: showCloseButton,
    showDenyButton: showDenyButton,
    showConfirmButton: showConfirmButton,
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
    denyButtonText: denyButtonText,
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      return onConfirmAction()
    } {
      onDeclineAction()
    }
  })
}

export default SweetAlert
