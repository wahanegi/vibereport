import React from "react";
import Menu from "./Menu";
import {backHandling, isPresent} from "../helpers/helpers";
import calendar from "../../../assets/images/calendar.svg"
import shoutout from "../../../assets/images/shoutout.svg"
import help_icon from "../../../assets/images/help.svg"
import logo from "../../../assets/images/logo.svg"
import edit_pencil from "../../../assets/images/edit-pencil.svg"
import {NavLink} from "react-router-dom";
import polygonLeft from "../../../assets/images/polygon-left.svg"
import polygonRight from "../../../assets/images/polygon-right.svg"
import editResponse from "../../../assets/images/editresponse.svg"
import line from "../../../assets/images/line.svg"

export const Logo = () => <img src={logo} alt="logo" style={{width: 190, height: 87}} />

export const BigBtnEmotion = ({ emotion, onClick, showPencil = true, addClass = '' }) =>
  <button className={`${addClass} btn-custom emotion ${emotion.category}`}>
    <span hidden={!showPencil} onClick={onClick} className="edit-icon">
      <img src={edit_pencil} alt="pencil"/>
    </span>
    {emotion.word}
  </button>

export const BtnSendMoreShoutouts = ({ onClick }) =>
  <button className={'btn-custom shoutout d-flex flex-nowrap align-items-center'} onClick={onClick}>
    Send more Shoutouts
    <span><img src={shoutout} alt="shoutout" style={{width: 36, height: 36, marginLeft: 5}}/></span>
  </button>

export const BtnOutline = ({ text, addClass = '', onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-feature c2 ${addClass}`} disabled={disabled}>
    {text}
  </button>

export const BtnPrimary = ({ text, addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const Calendar = ({ date, onClick, hidden = false, positionLeft = false,
                           positionRight = false, prevTimePeriod, isPenultimatePeriod = false}) =>
  isPresent(date) && !hidden && <div className="position-relative pointer" onClick={onClick} style={{maxWidth: 82}}>
    <img src={calendar} alt="calendar" />
    <div className="position-absolute top-0">
      {date.includes(' - ') ?
        <div className='mt-3 d-flex'>
          {date.split(' - ')[0]}
          <img src={line} alt="line" />
          {date.split(' - ')[1]}
        </div>:
        <div className='mt-5' style={{marginLeft: `${(isPresent(prevTimePeriod) && !isPenultimatePeriod) ? '9px' : '15px'}`}}>{date}</div>
      }
    </div>
    { prevTimePeriod && positionLeft && <img className="position-absolute" style={{left: -26, top: 29}} src={polygonLeft} alt="polygon left" /> }
    { positionRight && <img className="position-absolute" style={{right: -26, top: 29}} src={polygonRight} alt="polygon right"/> }
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
  <button onClick={onClick} className={`btn btn-regular c1 back ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const ShoutOutIcon = ({addClass = ''}) =>
  <div className={'m-0'}>
    <img className={`${addClass}`} src={shoutout} alt="shout out" style={{width: 100, height: 100}} />
  </div>


export const HelpIcon = () =>
  <NavLink to="mailto: support@vibereport.app" className='d-flex align-self-center'>
    <img src={help_icon} alt="shout out" className='help-icon' />
  </NavLink>

export const Footer = ({nextClick, skipClick, disabled = false, hideNext = false, hideSkip = true, }) =>
  <div className='d-flex justify-content-between m-3'>
    <ShoutOutIcon />
    <BtnBack onClick={backHandling} addClass='m-1 align-self-center' />
    <BtnNext onClick={nextClick} disabled={disabled} hidden={hideNext} addClass='m-1 align-self-center' />
    <BtnSkip onClick={skipClick} hidden={hideSkip} addClass='m-1 align-self-center' />
    <HelpIcon />
  </div>

export const Header = () => <div className='d-flex justify-content-between m-3'>
  <Logo />
  <Menu>X% complete</Menu>
</div>

export const Wrapper = ({children}) => <div className="wrapper">
  <div className="d-flex flex-column">
    {children}
  </div>
</div>

export const EditResponse = ({ hidden = false, onClick }) =>
  !hidden && <img className='pointer' src={editResponse} onClick={onClick} alt="edit response" />
