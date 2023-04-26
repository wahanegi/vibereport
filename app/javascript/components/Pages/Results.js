import React, {Fragment, useEffect, useState} from 'react';
import SweetAlert from "../UI/SweetAlert";
import {backHandling} from "../helpers/helpers";
import {BtnBack, BtnNext} from "../UI/ShareContent";
import axios from "axios";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {answers, emotions, fun_question, gif_urls, time_periods} = results
  const [timePeriod, setTimePeriod] = useState(data.time_period || {})
  const [timePeriodIndex, setTimePeriodIndex] = useState(0);
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const alertTitle = "<div class='fs-5'>Just to confirm...</div>" + `</br><div class='fw-bold'>${notice ? notice['alert'] : ''}</div>`
  const alertHtml = 'You previously indicated that you wern\'t working during this check-in period.</br>' +
  '</br></br>Skip this chek-in if you weren\'t working.'
  const cancelButtonText = 'Skip check-in'
  const confirmButtonText = 'Yes, I worked'
  console.log('results', results)
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

  const nextTimePeriod = () => {
    if (timePeriodIndex > 0) {
      setTimePeriodIndex(index => (index - 1));
    }
  }

  const prevTimePeriod = () => {
    if (timePeriodIndex < (time_periods.length - 1)) {
      setTimePeriodIndex(index => (index + 1));
    }
  }

  useEffect(() => {
    time_periods && setTimePeriod(time_periods[timePeriodIndex])
  }, [timePeriodIndex])

  useEffect(() => {
    axios.get(`/api/v1/results/${timePeriod.id}`)
      .then(res => {
        setResults(res.data)
        setLoaded(true)
      })
  }, [timePeriod])

  if (error) return <p>{error.message}</p>
  console.log('timePeriodIndex',timePeriodIndex)
  return <Fragment>
    {
      loaded && !isLoading && <div>
        {
          notice && <SweetAlert {...{onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText}} />
        }
        <BtnBack onClick={prevTimePeriod} addClass='m-1 align-self-center' />
        <BtnNext onClick={nextTimePeriod} hidden={timePeriodIndex === 0} addClass='m-1 align-self-center' />
        <p>User was not working for this time period</p>
        <BtnBack onClick={backHandling} />
      </div>
    }
  </Fragment>
}
export default Results;
