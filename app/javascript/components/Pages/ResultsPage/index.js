import React, {Fragment, useEffect, useState} from 'react';
import SweetAlert from "../../UI/SweetAlert";
import {isBlank, isPresent, rangeFormat} from "../../helpers/helpers";
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
import {useParams} from "react-router-dom";
import {updateResponse} from "../../requests/axios_requests";
import Loader from "../../UI/Loader";

export const loadResultsCallback = (timePeriod, setLoaded, setResults, url = '/api/v1/results/' ) => {
  useEffect(() => {
    setLoaded(false)
    axios.get(`${url}${timePeriod.slug}`)
      .then(res => {
        setResults(res.data)
        setLoaded(true)
      })
  }, [timePeriod.id])
}

export const scrollTopTimePeriodCallback = (nextTimePeriod) => {
  useEffect(() => {
    if (!nextTimePeriod) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }, [nextTimePeriod]);
}

export const scrollTopModalCallback = (showModal) => {
  useEffect(() => {
    if (showModal) {
      window.scrollTo({top: 200, behavior: 'smooth'})
    }
  }, [showModal])
};

export const changeTimePeriodCallback = (time_periods, setTimePeriod, setPrevTimePeriod, setNextTimePeriod, timePeriodIndex) => {
  useEffect(() => {
    if (time_periods) {
      setTimePeriod(time_periods[timePeriodIndex])
      setPrevTimePeriod(time_periods[timePeriodIndex + 1])
      setNextTimePeriod(time_periods[timePeriodIndex - 1])
    }
  }, [timePeriodIndex, time_periods?.length])
};

const Results = ({data, setData, steps = data.response.attributes.steps || [], draft = true}) => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {answers, emotions, fun_question, gifs, time_periods, sent_shoutouts, received_shoutouts,
        current_user_shoutouts, responses_count, current_user, received_and_public_shoutouts} = results
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
  const [slug, setSlug] = useState(useParams().slug)

  const onConfirmAction = () => {
    steps[steps.length - 1] = notice['last_step']
    const dataRequest = {
      response: {
        attributes: {
          not_working: false,
          emotion_id: notice['emotion_id']
        }
      }
    }
    updateResponse(data, setData, dataRequest).then()
    setNotice(null)
    onRemoveAlert()
  }

  const onDeclineAction = () => {
    setNotice(null)
    onRemoveAlert()
  }

  const isMinUsersResponses = responses_count < MIN_USERS_RESPONSES

  const showNextTimePeriod = () => {
    if (timePeriod.id === time_periods[1].id && isPresent(data.prev_results_path)) return;

    if (timePeriodIndex > 0) {
      setSlug(null)
      setTimePeriodIndex(index => (index - 1));
    }
  }

  const showPrevTimePeriod = () => {
    if (timePeriodIndex < (time_periods.length - 1)) {
      setSlug(null)
      setTimePeriodIndex(index => (index + 1));
    }
  }

  loadResultsCallback(timePeriod, setLoaded, setResults)
  scrollTopTimePeriodCallback(nextTimePeriod)
  scrollTopModalCallback(showModal)
  changeTimePeriodCallback(time_periods, setTimePeriod, setPrevTimePeriod, setNextTimePeriod, timePeriodIndex)

  useEffect(() => {
    if (time_periods && slug) {
      const foundTimePeriod = time_periods.find(time_period => String(time_period.slug) === slug);
      if (foundTimePeriod) {
        const index = time_periods.indexOf(foundTimePeriod);
        setTimePeriodIndex(index);
      }
    }
  }, [time_periods]);

  const Footer = () => <Fragment>
    <QuestionButton data={data} />
    <ShoutOutIcon addClass={nextTimePeriod ? 'd-none' : 'hud shoutout'} onClick = {() => {setShowModal(true)}} />
    {
      nextTimePeriod && isBlank(data.prev_results_path) ?
        <div className='mt-5'>
          <BtnBack text ='Back to most recent' addClass='mb-4 mt-5' onClick={() => setTimePeriodIndex(0)} />
        </div>:
        <div style={{height: 120}}></div>
    }
  </Fragment>

  if(!loaded) return <Loader />

  return loaded && <Fragment>
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
        <NavigationBar {...{timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod, steps,
                            emotions, data, setShowWorkingModal, setData }} />
        <EmotionSection emotions={emotions} nextTimePeriod={nextTimePeriod} data={data} isMinUsersResponses={isMinUsersResponses} />
        <GifSection gifs={gifs} nextTimePeriod={nextTimePeriod} isMinUsersResponses={isMinUsersResponses} />
        <ShoutoutSection nextTimePeriod={nextTimePeriod}
                         current_user={current_user}
                         timePeriod={timePeriod}
                         sentShoutouts={sent_shoutouts}
                         receivedShoutouts={received_shoutouts}
                         data={data} setData={setData}
                         isMinUsersResponses={isMinUsersResponses}
                         currentUserShoutouts={current_user_shoutouts}
                         recivedPublicShoutouts={received_and_public_shoutouts} />
        <QuestionSection fun_question={fun_question}
                         current_user={current_user}
                         answers={answers}
                         isMinUsersResponses={isMinUsersResponses}
                         nextTimePeriod={nextTimePeriod}
                         data={data}
                         setData={setData}
                         setShowWorkingModal={setShowWorkingModal}/>
        <CornerElements data={data} setData={setData} steps={steps} draft={draft} hideBottom={true} isResult={true}/>
      </Wrapper>
      <Footer />
    </div>
    {
      showModal && <ShoutoutModal onClose = {() => {setShowModal(false)} }
                                  data={data} setData={setData} />

    }
    <WorkingModal show={showWorkingModal} setShow={setShowWorkingModal}
                  data={data} setData={setData} steps={steps} />
  </Fragment>
}
export default Results;
