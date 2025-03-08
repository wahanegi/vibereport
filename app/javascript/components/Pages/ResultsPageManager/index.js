import React, {Fragment, useState} from 'react';
import LeaderVector from '../../../../assets/images/LeaderVector.svg';
import {MIN_MANAGER_USERS_RESPONSES} from "../../helpers/consts";
import {isBlank, rangeFormat} from "../../helpers/helpers";
import Layout from '../../Layout';
import {updateResponse} from "../../requests/axios_requests";
import Loader from "../../UI/Loader";
import {BtnBack, ShoutOutIcon,} from "../../UI/ShareContent";
import SweetAlert from "../../UI/SweetAlert";
import ShoutoutModal from '../modals/ShoutoutModal';
import WorkingModal from "../modals/WorkingModal";

import {
  changeTimePeriodCallback,
  loadResultsCallback,
  onChangeTimePeriodIndex,
  onRemoveAlert,
  scrollTopModalCallback,
  scrollTopTimePeriodCallback
} from "../ResultsPage";
import EmotionIndex from "../ResultsPageManager/EmotionIndex"
import NavigationBar from "./NavigationBar";

const ResultsManager = ({data, setData, steps = data.response.attributes.steps || [], draft = true}) => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState({})
  const {emotions, responses_count, teams, prev_results_path} = results
  const {time_periods, time_period, current_user} = data
  const [timePeriod, setTimePeriod] = useState(time_period || {})
  const [prevTimePeriod, setPrevTimePeriod] = useState(null)
  const [nextTimePeriod, setNextTimePeriod] = useState(null)
  const [timePeriodIndex, setTimePeriodIndex] = useState(current_user.time_period_index);
  const [notice, setNotice] = useState(data.response.attributes?.notices || null)
  const alertTitle = "<div>Just to confirm...</div>" + `</br><div class='fw-bold'>${notice ? notice['alert'] : ''}</div>`
  const alertHtml = 'You previously indicated that you wern\'t working during this check-in period.</br>' +
    '</br></br>Skip this chek-in if you weren\'t working.'
  const cancelButtonText = 'Skip check-in'
  const confirmButtonText = 'Yes, I worked'
  const [showModal, setShowModal] = useState(false)
  const [showWorkingModal, setShowWorkingModal] = useState(false)
  const initialIndex = 0

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

  const isMinUsersResponses = responses_count < MIN_MANAGER_USERS_RESPONSES

  const showNextTimePeriod = () => {
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

  loadResultsCallback(timePeriod, setLoaded, setResults, data, '/api/v1/result_managers/')
  changeTimePeriodCallback(time_periods, setTimePeriod, setPrevTimePeriod, setNextTimePeriod, timePeriodIndex)
  scrollTopTimePeriodCallback(nextTimePeriod)
  scrollTopModalCallback(showModal)


  if (!loaded) return <Loader/>

  return loaded && <Layout data={data} setData={setData} steps={steps} draft={draft} hideShoutout={nextTimePeriod ? true : false} isResult={true}>
    <div className='max-width-container mx-1'>
      <>
        {
          notice && <SweetAlert {...{
            onConfirmAction,
            onDeclineAction,
            alertTitle,
            alertHtml,
            cancelButtonText,
            confirmButtonText
          }} />
        }
        {
          !nextTimePeriod ?
            isMinUsersResponses ?
              <>
                <h1 className='fs-md-1 mb-0'>You're one of the first<br/>to check in!</h1>
                <h6 className='fs-md-7'>Come back later to view the results </h6><br/>
              </> :
              <h1 className='fs-md-1'>The team is feeling...</h1> :
            <h1 className='fs-md-1'>During {rangeFormat(timePeriod)} <br/> the team was feeling...
            </h1>
        }
        <NavigationBar {...{
          timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod, steps,
          emotions, data, setShowWorkingModal, setData, prev_results_path
        }} />
        <div className="folder-shape left-cut mt-7">
          <div className="right-cut">
            <div className='folder-line'></div>
            <div className="d-flex flex-column flex-md-row align-items-center fs-lg-8 fs-xl-7 position">
              <span className='d-none d-sm-block'>Leader Panel</span>
              <img className="leader-vector" src={LeaderVector} alt="Leader Vector" />
            </div>
          </div>
          <EmotionIndex teams={teams} nextTimePeriod={nextTimePeriod} isMinUsersResponses={isMinUsersResponses}/>
        </div>
      </>
      {
        nextTimePeriod && isBlank(data.prev_results_path) ?
          <div className='mt-5'>
            <BtnBack text='Back to most recent' addClass='mb-4 mt-5 fs-7 fs-sm-5'
                    onClick={() => onChangeTimePeriodIndex(current_user, initialIndex, setTimePeriodIndex, data, setData)}
            />
          </div> :
          <div style={{height: 120}}></div>
      }
    </div>
    {
      showModal && <ShoutoutModal onClose={() => {
        setShowModal(false)
      }} data={data} setData={setData}/>

    }
    <WorkingModal show={showWorkingModal} setShow={setShowWorkingModal}
                  data={data} setData={setData} steps={steps}/>
  </Layout>
}
export default ResultsManager;
