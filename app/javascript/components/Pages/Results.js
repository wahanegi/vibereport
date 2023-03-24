import React, {Fragment, useState} from 'react';
import BackButton from "../UI/BackButton";
import Swal from "sweetalert2";
import {removeResponse} from "../requests/axios_requests";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const onRemoveAlert = () => {
    saveDataToDb( steps, { notices: null } )
  }

  const Alert = () => {
    if (!notice) return null

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary ms-5 fs-5',
        cancelButton: 'btn btn-danger fs-5',
        closeButton: 'swal2-close-button'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: "<div class='fs-5'>Just to confirm...</div>" +
        "</br><div class='fw-bold'>Did you work during this </br>check-in period?</div>",
      html: 'You previously indicated that you wern\'t working during this check-in period.</br>' +
        '</br></br>Skip this chek-in if you weren\'t working.',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Skip check-in',
      confirmButtonText: 'Yes, I worked',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        setNotice(null)
        return removeResponse(data, setData).then()
      } {
        setNotice(null)
        onRemoveAlert()
      }
    })
  }

  if (error) return <p>{error.message}</p>

  return <Fragment>
    {
      !isLoading && <div>
        <Alert />
        <p>User was not working for this time period</p>
        <div>
          <BackButton data={data} setData={setData}>Back</BackButton>
        </div>
      </div>
    }
  </Fragment>

}
export default Results;
