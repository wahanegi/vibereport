import React from 'react';
import Swal from "sweetalert2";

const SweetAlert = ({onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText, cancelButtonClass, backdropClass}) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary ms-5 fs-5',
      cancelButton: `btn fs-5 ${cancelButtonClass || 'btn-danger'}`,
      closeButton: 'swal2-close-button',
      // popup: `${backdropClass || ''}`
      // background: `${backdropClass || ''}`
    },
    buttonsStyling: false
  })

  const backdropStyle = backdropClass ? {
    background: '#A6A1A1 !important',
    filter: 'blur(50px) !important'
  } : {};

  swalWithBootstrapButtons.fire({
    title: alertTitle,
    html: alertHtml,
    showCancelButton: true,
    showCloseButton: true,
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
    reverseButtons: true,
    backdrop:  'rgba(166, 161, 161, 85%)',
    // background: '#A6A1A1',
    // filter: 'blur(50px)'
    // backdrop: `${backdropClass}`
    // backdrop: 'radial-gradient(rgba(166,161,161,1) 80%, rgba(255,255,255,1) 100%)'
    // background-color: ${backdropClass || 'rgba(0,0,0,.4)'} !important;
  }).then((result) => {
    if (result.isConfirmed) {
      return onConfirmAction()
    } {
      onDeclineAction()
    }
  })
}

export default SweetAlert
