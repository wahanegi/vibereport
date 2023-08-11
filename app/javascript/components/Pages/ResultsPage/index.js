import React, {Fragment, useEffect, useRef, useState} from 'react';
import SweetAlert from "../../UI/SweetAlert";
import {rangeFormat} from "../../helpers/helpers";
import {
  BtnBack,
  ShoutOutIcon,
  Wrapper
} from "../../UI/ShareContent";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import EmotionSection from "./EmotionSection";
import GifSection from "./GifSection";
import QuestionSection from "./QuestionSection";
import ShoutoutSection from "./ShoutoutSection";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import CornerElements from "../../UI/CornerElements";
import ShoutoutModal from "../../UI/ShoutoutModal";
import QuestionButton from "../../UI/QuestionButton";
import WorkingModal from "../modals/WorkingModal";

const Results = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {answers, emotions, fun_question, gifs, time_periods, sent_shoutouts, received_shoutouts,
        current_user_shoutouts, responses_count, current_user} = results
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
  const [showModal, setShowModal] = useState(false)
  const [showWorkingModal, setShowWorkingModal] = useState(false)

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

  const isMinUsersResponses = responses_count < MIN_USERS_RESPONSES

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

  const Footer = () => <Fragment>
    <QuestionButton data={data} />
    <ShoutOutIcon addClass={nextTimePeriod ? 'd-none' : 'hud shoutout'} onClick = {() => {setShowModal(true)}} />
    {
      nextTimePeriod ?
        <div className='mt-5'>
          <BtnBack text ='Back to most recent' addClass='mb-4 mt-5' onClick={() => setTimePeriodIndex(0)} />
        </div>:
        <div style={{height: 120}}></div>
    }
  </Fragment>

  useEffect(() => {
    if (time_periods) {
      setTimePeriod(time_periods[timePeriodIndex])
      setPrevTimePeriod(time_periods[timePeriodIndex + 1])
      setNextTimePeriod(time_periods[timePeriodIndex - 1])
    }
  }, [timePeriodIndex, time_periods?.length])

  useEffect(() => {
    axios.get(`/api/v1/results/${timePeriod.slug}`)
      .then(res => {
        setResults(res.data)
        setLoaded(true)
      })
  }, [timePeriod, data])

  if (error) return <p>{error.message}</p>

  useEffect(() => {
    if (!nextTimePeriod) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }, [nextTimePeriod]);

  useEffect(() => {
    if (showModal) {
      window.scrollTo({top: 200, behavior: 'smooth'})
    }
  }, [showModal]);

  return loaded && !isLoading && <Fragment>
    <div className='position-relative'>
      <Wrapper>
        {
          notice && <SweetAlert {...{onConfirmAction, onDeclineAction, alertTitle, alertHtml, cancelButtonText, confirmButtonText}} />
        }
        {
          !nextTimePeriod ?
            isMinUsersResponses ?
              <div className='text-header-position'>
                <h1 className='mb-0'>You're one of the first<br/>to check in!</h1>
                <h6>Come back later to view the results </h6><br/>
              </div>:
              <h1 className='text-header-position'><br/>The team is feeling...</h1>:
            <h1 className='text-header-position'>During {rangeFormat(timePeriod)} <br/> the team was feeling...</h1>
        }
        <NavigationBar {...{timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod, steps, saveDataToDb, emotions, data, setShowWorkingModal }} />
        <EmotionSection emotions={emotions} nextTimePeriod={nextTimePeriod} data={data} isMinUsersResponses={isMinUsersResponses} />
        <GifSection gifs={gifs} nextTimePeriod={nextTimePeriod} isMinUsersResponses={isMinUsersResponses} />
        <ShoutoutSection nextTimePeriod={nextTimePeriod}
                         timePeriod={timePeriod}
                         sentShoutouts={sent_shoutouts}
                         receivedShoutouts={received_shoutouts}
                         data={data} setData={setData}
                         isMinUsersResponses={isMinUsersResponses}
                         currentUserShoutouts={current_user_shoutouts} />
        <QuestionSection fun_question={fun_question}
                         current_user={current_user}
                         answers={answers}
                         steps={steps}
                         saveDataToDb={saveDataToDb}
                         isMinUsersResponses={isMinUsersResponses}
                         nextTimePeriod={nextTimePeriod}
                         setShowWorkingModal={setShowWorkingModal}/>
        <CornerElements data={data} setData={setData} steps={steps} draft={draft} hideBottom={true}/>
      </Wrapper>
      <Footer />
    </div>
    {
      showModal && <ShoutoutModal onClose = {() => {setShowModal(false)} }
                                  data={data} setData={setData} />

    }
    <WorkingModal show={showWorkingModal} setShow={setShowWorkingModal} saveDataToDb={saveDataToDb} steps={steps} />
  </Fragment>
}
export default Results;
