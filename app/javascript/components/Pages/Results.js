import React, {Fragment, useState} from 'react';
import BackButton from "../UI/BackButton";
import SweetAlert from "../UI/SweetAlert";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const alertTitle = "<div class='fs-5'>Just to confirm...</div>" + `</br><div class='fw-bold'>${notice ? notice['alert'] : ''}</div>`
  const alertHtml = 'You previously indicated that you wern\'t working during this check-in period.</br>' +
  '</br></br>Skip this chek-in if you weren\'t working.'
  const cancelButtonText = 'Skip check-in'
  const confirmButtonText = 'Yes, I worked'

  const onRemoveAlert = () => {
    saveDataToDb( steps, { notices: null } )
  }

  const onConfirmAction = () => {
    steps[steps.length - 1] = notice['last_step']
    const dataRequest = {
      not_working: false,
      emotion_id: notice['emotion_id']
    }
    saveDataToDb( steps, dataRequest )
    setNotice(null)
    onRemoveAlert()
  }

  const onDeclineAction = () => {
    setNotice(null)
    onRemoveAlert()
  }

  if (error) return <p>{error.message}</p>

  return <Fragment>
    {
      !isLoading && <div>
        {
          notice && <SweetAlert {...{onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText}} />
        }
        <p>User was not working for this time period</p>
        <div>
          <BackButton data={data} setData={setData}>Back</BackButton>
        </div>
      </div>
    }
  </Fragment>

}
export default Results;
