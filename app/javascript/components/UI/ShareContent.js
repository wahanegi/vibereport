import React, { useState } from 'react';
import Menu from "./Menu";
import {backHandling, isPresent} from "../helpers/helpers";
import calendar from "../../../assets/images/calendar.svg"
import shoutout from "../../../assets/images/shoutout.svg"
import help_icon from "../../../assets/images/help.svg"
import edit_pencil from "../../../assets/images/edit-pencil.svg"
import {NavLink, useNavigate, useParams} from "react-router-dom";
import polygonLeft from "../../../assets/images/polygon-left.svg"
import polygonRight from "../../../assets/images/polygon-right.svg"
import editResponse from "../../../assets/images/editresponse.svg"
import line from "../../../assets/images/line.svg"
import {MIN_USERS_RESPONSES} from "../helpers/consts";
import Logo from "./Logo";
import ResultsPageManager from "../Pages/ResultsPageManager";
import LeaderVector from '../../../assets/images/OpenLeaderPanelButton.svg';
import ResultsPage from "../Pages/ResultsPage";
import BackRevert from '../../../assets/images/BackToResultsButton.svg';
import {updateResponse} from "../requests/axios_requests";

export const BigBtnEmotion = ({ emotion, onClick, showPencil = true, addClass = '', selectedType }) =>{
  const categoryClass = selectedType || emotion.category;
  const categoryStyles = {
    positive: 'bg-green-200 text-success',
    neutral: 'bg-pale-cornflower text-steel-blue',
    negative: 'bg-apricot text-cinnamon',
  };

  const appliedStyles = categoryStyles[categoryClass] || '';
return(
  <button className={`${addClass} btn-custom emotion ${appliedStyles}`}>
    <span hidden={!showPencil} onClick={onClick} className="edit-icon">
      <img src={edit_pencil} alt="pencil"/>
    </span>
    {emotion.word}
  </button>
  )
}

export const BtnSendMoreShoutouts = ({ onClick }) =>
  <button className={'btn-custom shoutout text-primary bg-white d-flex flex-nowrap align-items-center'} onClick={onClick}>
    Send more Shoutouts
    <span><img src={shoutout} alt="shoutout"/></span>
  </button>

export const BtnOutline = ({ text, addClass = '', onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-feature text-gray-300 text-gray-300-hover bg-white c2 ${addClass}`} disabled={disabled}>
    {text}
  </button>

export const BtnPrimary = ({ text, addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const Calendar = ({ date, onClick, hidden = false, positionLeft = false,
                           positionRight = false, prevTimePeriod, emotions, nextTimePeriod}) =>
  isPresent(date) && !hidden && <div className="position-relative">
    { prevTimePeriod && positionLeft ?
      emotions.length < MIN_USERS_RESPONSES && !nextTimePeriod ?
        <p className="position-absolute" style={{right: -48, bottom: 63, width: 180}}>See last week’s results</p>:
        <p className="position-absolute" style={{right: -48, bottom: 63, width: 180}}>See previous results</p>:
      null
    }
    { positionRight && <p className="position-absolute" style={{right: -48, bottom: 63, width: 180}}>See next results</p> }
    <div className="position-relative pointer w-82 mt-1" onClick={onClick}>
      <img src={calendar} alt="calendar" />
      <div className="position-absolute top-0 w-82" >
        {date.includes(' - ') ?
          <div className='mt-3 d-flex flex-column'>
            {date.split(' - ')[0]}
            <img src={line} alt="line" />
            {date.split(' - ')[1]}
          </div>:
          <div className='mt-5 d-flex'>{date}</div>
        }
      </div>
      { prevTimePeriod && positionLeft && <img className="position-absolute" style={{left: -26, top: 29}} src={polygonLeft} alt="polygon left" /> }
      { positionRight && <img className="position-absolute" style={{right: -26, top: 29}} src={polygonRight} alt="polygon right"/> }
    </div>
  </div>

export const BtnNext = ({ addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    Next
  </button>

export const BtnSkip = ({ addClass = '', hidden = true, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    Skip
  </button>

export const BtnBack = ({ addClass = '', hidden, onClick, disabled, text = 'Back' }) =>
  <button onClick={onClick} className={`btn btn-regular c1 bg-gray-200 bg-gray-hover-200 ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const ShoutOutIcon = ({addClass = '', onClick}) =>
  <div className={'m-0 pointer'} onClick={onClick}>
    <img className={`${addClass}`} src={shoutout} alt="shout out" style={{width: 100, height: 100}} />
  </div>


export const HelpIcon = ({addClass=''}) =>
  <NavLink to="mailto: support@vibereport.app" className={`${addClass} d-flex align-self-center`}>
    <img src={help_icon} alt="shout out" className='help-icon' />
  </NavLink>

export const Footer = ({nextClick, skipClick, disabled = false, hideNext = false, hideSkip = true, }) =>
  <div className='d-flex justify-content-between m-3'>
    <BtnBack onClick={backHandling} addClass='m-1 align-self-center' />
    <BtnNext onClick={nextClick} disabled={disabled} hidden={hideNext} addClass='m-1 align-self-center' />
    <BtnSkip onClick={skipClick} hidden={hideSkip} addClass='m-1 align-self-center' />
  </div>

export const Header = ({saveDataToDb, steps, draft, disabled, data, handleSaveDraft}) => <div className='d-flex justify-content-between m-3'>
  {/*<Logo />*/}
  <Menu saveDataToDb={saveDataToDb} steps={steps} draft={draft} disabled={disabled} data={data} handleSaveDraft={handleSaveDraft}>X% complete</Menu>
</div>

export const EditResponse = ({ hidden = false, onClick }) =>
  !hidden && <button className='border-0 bg-transparent' onClick={onClick}>
    <p className='m-0'>Edit responses</p>
    <img className='pointer' src={editResponse} alt="edit response" />
  </button>

export const ResultsManager = ({ data, setData, steps, draft, service, nextTimePeriod}) => {
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
    <div className={`ms-auto ${nextTimePeriod ? 'me-2' : ''}`}>
      <div
        className="b4 position-result pointer"
        onClick={handlingOnClickImage}
      >
        <img
            className='ms-1'
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
    </div>
  );
}

export const Results = ({ data, setData, steps, hidden = false }) => {
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