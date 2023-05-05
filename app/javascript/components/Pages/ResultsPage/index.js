import React, {useEffect, useState} from 'react';
import SweetAlert from "../../UI/SweetAlert";
import {lastEl, rangeFormat} from "../../helpers/helpers";
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
import ShoutoutSection from "./ShoutoutSection";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {answers, emotions, fun_question, gifs, time_periods} = results
  const [timePeriod, setTimePeriod] = useState(data.time_period || {})
  const [prevTimePeriod, setPrevTimePeriod] = useState(null)
  const [nextTimePeriod, setNextTimePeriod] = useState(null)
  const [timePeriodIndex, setTimePeriodIndex] = useState(0);
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

  const showNextTimePeriod = () => {
    if (timePeriodIndex > 0) {
      setTimePeriodIndex(index => (index - 1));
    }
  }

  const showPrevTimePeriod = () => {
    if (timePeriodIndex < (time_periods.length - 1)) {
      setTimePeriodIndex(index => (index + 1));
    }
  }

  const Footer = () =>
    <div className='d-flex justify-content-between m-3'>
      <ShoutOutIcon addClass={nextTimePeriod ? 'd-none' : ''} />
      <div className="d-flex flex-column mb-3">
        <BtnBack text ='Back to current week' hidden={!nextTimePeriod} addClass='mb-2' onClick={() => setTimePeriodIndex(0)} />
        <BtnPrimary text ='Done' addClass='mt-auto' />
      </div>
      <HelpIcon />
    </div>

  useEffect(() => {
    if (time_periods) {
      setTimePeriod(time_periods[timePeriodIndex])
      setPrevTimePeriod(time_periods[timePeriodIndex + 1])
      setNextTimePeriod(time_periods[timePeriodIndex - 1])
    }
    }, [timePeriodIndex, time_periods?.length])

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
    <NavigationBar {...{timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod}} />
    <EmotionSection emotions={emotions} nextTimePeriod={nextTimePeriod} data={data} />
    <GifSection gifs={gifs} nextTimePeriod={nextTimePeriod} />
    <ShoutoutSection nextTimePeriod={nextTimePeriod} />
    <QuestionSection fun_question={fun_question} answers={answers} nextTimePeriod={nextTimePeriod} />
    <Footer />
  </Wrapper>
  }
export default Results;
