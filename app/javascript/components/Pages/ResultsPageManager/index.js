import React, {Fragment, useEffect, useRef, useState} from 'react';
import SweetAlert from "../../UI/SweetAlert";
import {rangeFormat} from "../../helpers/helpers";
import {
  BtnBack,
  ShoutOutIcon,
  Wrapper
} from "../../UI/ShareContent";
import NavigationBar from "./NavigationBar";
import CornerElements from "../../UI/CornerElements";
import QuestionButton from "../../UI/QuestionButton";
import WorkingModal from "../modals/WorkingModal";
import LeaderVector from '../../../../assets/images/LeaderVector.svg';
import EmotionIndex from "../ResultsPageManager/EmotionIndex"
import {updateResponse} from "../../requests/axios_requests";
import Loader from "../../UI/Loader";
import {MIN_MANAGER_USERS_RESPONSES} from "../../helpers/consts";
import {changeTimePeriodCallback, loadResultsCallback, scrollTopModalCallback, scrollTopTimePeriodCallback} from "../ResultsPage";

const ResultsManager = ({data, setData, steps = data.response.attributes.steps || [], draft = true}) => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( {})
  const {emotions, time_periods, responses_count, teams, prev_results_path} = results
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
    const dataRequest = {
      response: {attributes: {notices: null}}
    }
    updateResponse(data, setData, dataRequest).then()
  }

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

  const isMinUsersResponses = responses_count < MIN_MANAGER_USERS_RESPONSES

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

  loadResultsCallback(timePeriod, setLoaded, setResults, '/api/v1/result_managers/')
  changeTimePeriodCallback(time_periods, setTimePeriod, setPrevTimePeriod, setNextTimePeriod, timePeriodIndex)
  scrollTopTimePeriodCallback(nextTimePeriod)
  scrollTopModalCallback(showModal)

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
                            emotions, data, setShowWorkingModal, setData, prev_results_path }} />
        <div className="folder-shape left-cut">
          <div className="right-cut">
            <div className='folder-line'></div>
            <div className="b3 position">Leader Panel
              <img className="image-container ms-1" src={LeaderVector} />
            </div>
          </div>
          <EmotionIndex teams={teams} nextTimePeriod={nextTimePeriod} isMinUsersResponses={isMinUsersResponses} />
        </div>
        <CornerElements data={data} setData={setData} steps={steps} draft={draft} hideBottom={true} isResult={true} />
      </Wrapper>
      <Footer />
    </div>
    <WorkingModal show={showWorkingModal} setShow={setShowWorkingModal}
                  data={data} setData={setData} steps={steps} />
  </Fragment>
}
export default ResultsManager;
