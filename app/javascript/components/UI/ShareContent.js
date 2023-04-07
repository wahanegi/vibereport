import Menu from "./Menu";
import React from "react";
import {backHandling, rangeFormat} from "../helpers/helpers";
import shout_out_large from "../../../assets/images/shoutout-large.svg"
import help_icon from "../../../assets/images/help.svg"
import logo from "../../../assets/images/logo.svg"
import edit_pencil from "../../../assets/images/edit-pencil.svg"
import {NavLink} from "react-router-dom";

export const Logo = () => <img src={logo} alt="logo" style={{width: 190, height: 87}} />

export const BigBtnEmotion = ({ emotion, onClick, showPencil = true, addClass = '' }) =>
  <button className={`${addClass} btn emotion ${emotion.category}`}>
    <span hidden={!showPencil} onClick={onClick} className="edit-icon">
      <img src={edit_pencil} alt="pencil"/>
    </span>
    {emotion.word}
  </button>

export const BtnOutline = ({ text, addClass = '', onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-feature c2 ${addClass}`} disabled={disabled}>
    {text}
  </button>

export const BtnPrimary = ({ text, addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    {text}
  </button>

export const Calendar = ({ timePeriod }) =>
  <div className="h-40">
    <div className="calendar ml-240 mt-37">
      <div className="data mx-auto my-0 ">
        21 Jan
      </div>
    </div>
  </div>

export const BtnNext = ({ addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn btn-regular c1 ${addClass}`} hidden={hidden} disabled={disabled}>
    Next
  </button>

export const BtnBack = ({ addClass = '', hidden, onClick, disabled }) =>
  <button onClick={onClick} className={`btn  btn-regular c1 back ${addClass}`} hidden={hidden} disabled={disabled}>
    Back
  </button>

export const ShoutOutIcon = () =>
  <img src={shout_out_large} alt="shout out" style={{width: 100, height: 100}} />

export const HelpIcon = () =>
  <NavLink to="mailto: support@vibereport.app">
    <img src={help_icon} alt="shout out" className='help-icon' style={{width: 100, height: 100}} />
  </NavLink>

export const Footer = ({nextClick}) => <div className='d-flex justify-content-between m-3'>
  <ShoutOutIcon />
  <BtnBack onClick={backHandling} addClass='m-1 align-self-center' />
  <BtnNext onClick={nextClick} addClass='m-1 align-self-center' />
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