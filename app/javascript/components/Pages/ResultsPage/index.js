import axios from "axios";
import React, {useEffect, useState} from 'react';
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import {isBlank, isPresent, rangeFormat} from "../../helpers/helpers";
import Layout from '../../Layout';
import {apiRequest, updateResponse} from "../../requests/axios_requests";
import Loader from "../../UI/Loader";
import {BtnBack} from "../../UI/ShareContent";
import SweetAlert from "../../UI/SweetAlert";
import WorkingModal from "../modals/WorkingModal";
import EmotionSection from "./EmotionSection";
import GifSection from "./GifSection";
import NavigationBar from "./NavigationBar";
import QuestionSection from "./QuestionSection";
import ShoutoutSection from "./ShoutoutSection";

export const loadResultsCallback = (timePeriod, setLoaded, setResults, data, url = '/api/v1/results/') => {
  useEffect(() => {
    setLoaded(false)
    axios.get(`${url}${timePeriod.slug}`)
      .then(res => {
        setResults(res.data)
        setLoaded(true)
      })
  }, [timePeriod.id, data.user_shoutouts.length])
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

export const onRemoveAlert = (updateResponse, data, setData) => {
  const dataRequest = {
    response: {attributes: {notices: null}}
  }
  updateResponse(data, setData, dataRequest).then()
}

export const onChangeTimePeriodIndex = (current_user, index, setTimePeriodIndex, data, setData) => {
  const dataSend = {time_period_index: index}
  const dataFromServer = ({current_user}) => {
    if (isPresent(current_user)) {
      setTimePeriodIndex(current_user.time_period_index)
      setData(Object.assign({}, data, {current_user}))
    }
  }
  const url = '/api/v1/users/'
  const id = current_user.id
  apiRequest("PATCH", dataSend, dataFromServer, () => {
  }, `${url}${id}`).then();
}

const Results = ({data, setData, steps = data.response.attributes.steps || [], draft = true}) => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState({})
  const {
    answers, emotions, fun_question, gifs, sent_shoutouts, received_shoutouts,
    current_user_shoutouts, responses_count, received_and_public_shoutouts, prev_results_path
  } = results
  const {time_periods, current_user} = data
  const [timePeriod, setTimePeriod] = useState(data.time_period || {})
  const [prevTimePeriod, setPrevTimePeriod] = useState(null)
  const [nextTimePeriod, setNextTimePeriod] = useState(null)
  const [timePeriodIndex, setTimePeriodIndex] = useState(current_user.time_period_index);
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const [showWorkingModal, setShowWorkingModal] = useState(false)
  const initialIndex = 0
  const isMinUsersResponses = responses_count < MIN_USERS_RESPONSES

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
    onRemoveAlert(updateResponse, data, setData)
  }

  const onDeclineAction = () => {
    setNotice(null)
    onRemoveAlert(updateResponse, data, setData)
  }

  const showNextTimePeriod = () => {
    if (timePeriod.id === time_periods[1].id && isPresent(data.prev_results_path)) return;

    if (timePeriodIndex > 0) {
      const index = timePeriodIndex - 1
      onChangeTimePeriodIndex(current_user, index, setTimePeriodIndex, data, setData)
    }
  }

  const showPrevTimePeriod = () => {
    if (timePeriodIndex < (time_periods.length - 1)) {
      const index = timePeriodIndex + 1
      onChangeTimePeriodIndex(current_user, index, setTimePeriodIndex, data, setData)
    }
  }

  loadResultsCallback(timePeriod, setLoaded, setResults, data)
  scrollTopTimePeriodCallback(nextTimePeriod)
  changeTimePeriodCallback(time_periods, setTimePeriod, setPrevTimePeriod, setNextTimePeriod, timePeriodIndex)

  const TextHeader = () => {
    if (!nextTimePeriod) {
      return (
        isMinUsersResponses ? (
          <div className='d-flex flex-column gap-1 mb-1 mb-md-0'>
            <h1 className="fs-md-1">You're one of the first to check in!</h1>
            <h6>Come back later to view the results</h6>
          </div>
        ) : (
          <h1 className="fs-md-1">The team is feeling...</h1>
        )
      );
    }

    return (
      <h1 className="fs-md-1">During {rangeFormat(timePeriod)}<br/> the team was feeling...</h1>
    );
  }

  const TimePeriodNavigation = () => {
    if (nextTimePeriod && isBlank(data.prev_results_path)) {
      return (
          <div className='mt-5'>
            <BtnBack text='Back to most recent' addClass='mb-4 mt-5 fs-7 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6'
                     onClick={() => onChangeTimePeriodIndex(current_user, initialIndex, setTimePeriodIndex, data, setData)}
            />
          </div>
      )
    }
    return <div className='my-5'></div>
  }

  const SkipCheckInAlert = () => {
    const alertTitle = `<div>Just to confirm...</div></br><div class='fw-bold'>${notice ? notice['alert'] : ''}</div>`
    const alertHtml = 'You previously indicated that you wern\'t working during this check-in period.</br></br></br>Skip this chek-in if you weren\'t working.'
    const cancelButtonText = 'Skip check-in'
    const confirmButtonText = 'Yes, I worked'

    return (notice && <SweetAlert {...{
      onConfirmAction,
      onDeclineAction,
      alertTitle,
      alertHtml,
      cancelButtonText,
      confirmButtonText
    }} />)
  }

  if (!loaded) return <Loader/>

  return <Layout data={data} setData={setData} steps={steps} draft={draft} hideBottom={true} isResult={true} hideShoutout={nextTimePeriod}>
    <div className='w-100 d-flex flex-column align-items-center gap-1 px-1 px-xxl-0 px-xl-0 px-lg-0 px-md-1 px-sm-1 pt-1 pt-md-0'>
      <SkipCheckInAlert/>

      <TextHeader/>

      <NavigationBar {...{
        timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods,
        prevTimePeriod, nextTimePeriod, steps,
        emotions, data, setShowWorkingModal, setData, prev_results_path
      }} />

      <EmotionSection emotions={emotions}
                      nextTimePeriod={nextTimePeriod}
                      data={data}
                      isMinUsersResponses={isMinUsersResponses}/>

      <GifSection gifs={gifs}
                  nextTimePeriod={nextTimePeriod}
                  isMinUsersResponses={isMinUsersResponses}/>

      <ShoutoutSection nextTimePeriod={nextTimePeriod}
                       current_user={current_user}
                       timePeriod={timePeriod}
                       sentShoutouts={sent_shoutouts}
                       receivedShoutouts={received_shoutouts}
                       data={data} setData={setData}
                       isMinUsersResponses={isMinUsersResponses}
                       currentUserShoutouts={current_user_shoutouts}
                       recivedPublicShoutouts={received_and_public_shoutouts}/>

      <QuestionSection fun_question={fun_question}
                       current_user={current_user}
                       answers={answers}
                       isMinUsersResponses={isMinUsersResponses}
                       nextTimePeriod={nextTimePeriod}
                       data={data}
                       setData={setData}
                       setShowWorkingModal={setShowWorkingModal}/>

      <TimePeriodNavigation/>
    </div>
    <WorkingModal
      show={showWorkingModal}
      setShow={setShowWorkingModal}
      data={data}
      setData={setData}
      steps={steps}/>
  </Layout>
}
export default Results;
