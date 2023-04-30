import React, {useEffect, useState} from 'react';
import SweetAlert from "../../UI/SweetAlert";
import {rangeFormat} from "../../helpers/helpers";
import {
  BtnBack,
  BtnPrimary,
  Header,
  HelpIcon,
  ShoutOutIcon,
  Wrapper
} from "../../UI/ShareContent";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import EmotionSection from "./EmotionSection";
import GifSection from "./GifSection";
import QuestionSection from "./QuestionSection";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {answers, emotions, fun_question, gifs, time_periods} = results
  const [timePeriod, setTimePeriod] = useState(data.time_period || {})
  const [timePeriodIndex, setTimePeriodIndex] = useState(0);
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const [positions, setPositions] = useState([]);
  const alertTitle = "<div class='fs-5'>Just to confirm...</div>" + `</br><div class='fw-bold'>${notice ? notice['alert'] : ''}</div>`
  const alertHtml = 'You previously indicated that you wern\'t working during this check-in period.</br>' +
  '</br></br>Skip this chek-in if you weren\'t working.'
  const cancelButtonText = 'Skip check-in'
  const confirmButtonText = 'Yes, I worked'
  // console.log('results', results)

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

  const Footer = () =>
    <div className='d-flex justify-content-between m-3'>
      <ShoutOutIcon addClass={timePeriodIndex !== 0 ? 'd-none' : ''} />
      <div className="d-flex flex-column mb-3">
        <BtnBack text ='Back to current week' hidden={timePeriodIndex === 0} addClass='mb-2' onClick={() => setTimePeriodIndex(0)} />
        <BtnPrimary text ='Done' addClass='mt-auto' />
      </div>
      <HelpIcon />
    </div>

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

  return loaded && !isLoading && <Wrapper>
    {
      notice && <SweetAlert {...{onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText}} />
    }
    <Header />
    {
      timePeriod.id === time_periods[0].id ?
        <h1>So far this week, the <br/> the team is feeling...</h1>:
        <h1>During {rangeFormat(timePeriod)} <br/> the team was feeling...</h1>
    }
    <NavigationBar {...{timePeriod, prevTimePeriod, nextTimePeriod, timePeriodIndex, time_periods}} />
    <EmotionSection emotions={emotions} />
    <GifSection gifs={gifs} />
    <QuestionSection fun_question={fun_question} answers={answers} />
    <Footer />
  </Wrapper>
  }
export default Results;
