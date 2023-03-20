import Menu from "./Menu";
import QuestionButton from "./QuestionButton";
import ShoutoutButton from "./ShoutoutButton";
import React from "react";
import {rangeFormat} from "../helpers/helpers";

export const RightPanel = () => <div className='col-2 mb-3 text-center'>
  <div className="d-flex align-items-end flex-column mb-3" style={{height: '95vh'}}>
    <div className="p-2">
      <Menu>X% complete</Menu>
    </div>
    <div className="mt-auto p-2">
      <QuestionButton />
    </div>
  </div>
</div>

export const Logo = () => <div className="p-2">
  <div className="convert increased-convert in_left">
    <p>Logo/Brand</p>
    <div className="line1 offset-line1"></div>
    <div className="line2 offset-line2"></div>
  </div>
</div>

export const LeftPanel = () => <div className='col-2 mb-3 text-center'>
  <div className="d-flex align-items-start flex-column mb-3" style={{height: '95vh'}}>
    <div className="p-2">
      <Logo />
    </div>
    <div className="mt-auto p-2">
      <ShoutoutButton style={{marginLeft: 15}} />
    </div>
  </div>
</div>

export const BigBtnEmotion = ({ emotion, onClick, showPencil = true, addClass = '' }) =>
  <button className={`${addClass} emotion-btn ${emotion.category}`}>
    <span hidden={!showPencil} onClick={onClick} className="edit-icon"></span>
    {emotion.word}
  </button>

export const BtnOutline = ({ text, addClass = '', onClick, disabled }) =>
  <button onClick={onClick} className={`outline-btn ${addClass}`} disabled={disabled}>
    {text}
  </button>

export const BtnPrimary = ({ text, addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`primary-btn ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const Calendar = ({ timePeriod }) =>
  <div className="calendar other-position">
    <div className="left-div offset-ld">
      <div className="part"></div>
    </div>
    <div className="right-div offset-rd">
      <div className="part"></div>
    </div>
    <div className="top-div"></div>
    <div className="time">
      {rangeFormat(timePeriod)}
    </div>
  </div>

export const BtnNext = ({ addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn-navigation next ${addClass}`} hidden={hidden} disabled={disabled}>
    Next
  </button>

export const BtnBack = ({ addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn-navigation back ${addClass}`} hidden={hidden} disabled={disabled}>
    Back
  </button>