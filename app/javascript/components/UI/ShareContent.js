import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import BackRevert from '../../../assets/images/BackToResultsButton.svg';
import calendar from "../../../assets/images/calendar.svg"
import edit_pencil from "../../../assets/images/edit-pencil.svg"
import editResponse from "../../../assets/images/editresponse.svg"
import line from "../../../assets/images/line.svg"
import LeaderVector from '../../../assets/images/OpenLeaderPanelButton.svg';
import polygonLeft from "../../../assets/images/polygon-left.svg"
import polygonRight from "../../../assets/images/polygon-right.svg"
import shoutout from "../../../assets/images/shoutout.svg"
import {MIN_USERS_RESPONSES} from "../helpers/consts";
import {backHandling, isPresent} from "../helpers/helpers";
import ResultsPage from "../Pages/ResultsPage";
import ResultsPageManager from "../Pages/ResultsPageManager";
import {updateResponse} from "../requests/axios_requests";
import Menu from "./Menu";

export const BigBtnEmotion = ({emotion, onClick, showPencil = true, addClass = '', selectedType}) => {
  const categoryClass = selectedType || emotion.category;
  const categoryStyles = {
    positive: 'bg-green-200 positive',
    negative: 'bg-apricot negative',
  };

  const appliedStyles = categoryStyles[categoryClass] || '';
  return (
    <button
      className={`${addClass} d-flex flex-column btn-custom px-4 rounded-pill emotion position-relative fs-2 ${appliedStyles}`}>
    <span hidden={!showPencil} onClick={onClick} className="position-absolute start-100 translate-middle">
      <img src={edit_pencil} alt="pencil"/>
    </span>
      {emotion.word}
    </button>
  )
}

export const BtnSendMoreShoutouts = ({onClick}) =>
  <button className={'btn-custom shoutout text-primary bg-white d-flex flex-nowrap align-items-center'}
          onClick={onClick}>
    Send more Shoutouts
    <span><img src={shoutout} alt="shoutout"/></span>
  </button>

export const BtnOutline = ({text, addClass = '', onClick, disabled}) =>
  <button onClick={onClick}
          className={`btn btn-feature btn-lg border border-3 rounded-4 border-royal-blue text-gray-300 text-gray-300-hover bg-white c2 ${addClass}`}
          disabled={disabled}>
    {text}
  </button>

export const BtnPrimary = ({text, addClass = '', hidden, onClick, disabled}) =>
  <button onClick={onClick} className={`btn btn-regular c1 border-1 border fs-5 ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const Calendar = ({
                             date,
                             onClick,
                             hidden = false,
                             positionLeft = false,
                             positionRight = false,
                             prevTimePeriod,
                             emotions,
                             nextTimePeriod
                         }) => {
    const seeResults = prevTimePeriod && positionLeft
        ? emotions.length < MIN_USERS_RESPONSES && !nextTimePeriod
            ? <p className="m-0">See last week’s results</p>
            : <p className="m-0">See previous results</p>
        : null

    return isPresent(date) && !hidden && <div className="position-relative" style={{width: 180, height: 105}}>
        {seeResults}
        {positionRight && <p className="m-0">See next results</p>}
        <div className="position-absolute translate-middle-x start-50" style={{top: 20}}>
            <div className="position-relative pointer" style={{height: 78, width: 83}} onClick={onClick}>
                <img className="translate-middle-x position-absolute top-0" src={calendar} alt="calendar"/>
                <div className="position-absolute top-0" style={{width: 83}}>
                    {date.includes(' - ')
                        ?
                        <div className='d-flex flex-column mt-3'>
                            {date.split(' - ')[0]}
                            <img src={line} alt="line"/>
                            {date.split(' - ')[1]}
                        </div>
                        : <div className="d-flex mt-5">{date}</div>
                    }</div>
            </div>
        </div>
        {prevTimePeriod && positionLeft &&
            <img className="position-absolute top-50" style={{left:23}} src={polygonLeft} alt="polygon left"/>}
        {positionRight &&
            <img className="position-absolute top-50" style={{right:23}} src={polygonRight} alt="polygon right"/>}
    </div>
}

export const BtnNext = ({addClass = '', hidden, onClick, disabled}) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    Next
  </button>

export const BtnSkip = ({addClass = '', hidden = true, onClick, disabled}) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    Skip
  </button>

export const BtnBack = ({addClass = '', hidden, onClick, disabled, text = 'Back'}) =>
  <button onClick={onClick} className={`btn btn-regular c1 bg-gray-200 bg-gray-hover-200 fs-5 ${addClass}`}
          hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const ShoutOutIcon = ({addClass = '', onClick}) =>
  <div className={'m-0 pointer'} onClick={onClick}>
    <img className={`${addClass}`} src={shoutout} alt="shout out" style={{width: 100, height: 100}}/>
  </div>

export const Footer = ({nextClick, skipClick, disabled = false, hideNext = false, hideSkip = true,}) =>
  <div className='d-flex justify-content-between m-3'>
    <BtnBack onClick={backHandling} addClass='m-1 align-self-center'/>
    <BtnNext onClick={nextClick} disabled={disabled} hidden={hideNext} addClass='m-1 align-self-center'/>
    <BtnSkip onClick={skipClick} hidden={hideSkip} addClass='m-1 align-self-center'/>
  </div>

export const Header = ({saveDataToDb, steps, draft, disabled, data, handleSaveDraft}) => <div
  className='d-flex justify-content-between m-3'>
  {/*<Logo />*/}
  <Menu saveDataToDb={saveDataToDb} steps={steps} draft={draft} disabled={disabled} data={data}
        handleSaveDraft={handleSaveDraft}>X% complete</Menu>
</div>

export const EditResponse = ({hidden = false, onClick}) =>
  !hidden && <button className='border-0 bg-transparent' onClick={onClick}>
    <p className='m-0'>Edit responses</p>
    <img className='pointer' src={editResponse} alt="edit response"/>
  </button>

export const ResultsManager = ({data, setData, steps, draft, service, nextTimePeriod}) => {
  const [showResultsManager, setShowResultsManager] = useState(false);
  const navigate = useNavigate()
  const slug = useParams().slug

  const handlingOnClickImage = () => {
    const hasTeamAccess = data.has_team_access;
    if (slug && hasTeamAccess) return navigate(`/result-managers/${slug}`)
    steps.push('result-managers')
    const dataRequest = {
      response: {attributes: {steps: steps}}
    }
    if (hasTeamAccess) {
      updateResponse(data, setData, dataRequest, navigate(`/${steps.slice(-1).toString()}`)).then()
    } else {
      setShowResultsManager(true);
    }
  };

  return (
    <>
      <div className="b4 position-result pointer" onClick={handlingOnClickImage}>
        <img
          src={LeaderVector}
          alt="Leader Vector"
        />
      </div>

      {showResultsManager &&
        <ResultsPageManager
          data={data}
          setData={setData}
          steps={steps}
          draft={draft}
          service={service}
        />
      }
    </>
  );
}

export const Results = ({data, setData, steps, hidden = false}) => {
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate()
  const slug = useParams().slug

  const handlingOnClickImage = () => {
    const hasTeamAccess = data.has_team_access;
    const dataRequest = {
      response: {
        attributes: {
          steps: steps
        }
      }
    }

    if (hasTeamAccess) {
      if (data.response.attributes.id) {
        steps.push('results');
        updateResponse(data, setData, dataRequest, navigate(`/${steps.slice(-1).toString()}`)).then();
      } else {
        if (isPresent(slug)) return navigate(`/results/${slug}`);

        navigate(`/${steps.slice(-1).toString()}`)
      }
    } else {
      setShowResults(true);
    }
  };

  return (
    !hidden && <div className='ms-auto me-2'>
      <div
        className="b4 position-result pointer"
        onClick={handlingOnClickImage}
      >
        <img
          className='ms-1'
          src={BackRevert}
          alt="Back Revert"
        />
      </div>

      {showResults &&
        <ResultsPage
          data={data}
          setData={setData}
          steps={steps}
        />
      }
    </div>
  );
}