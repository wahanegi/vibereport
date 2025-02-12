import React, {useEffect, useRef, useState} from 'react';
import {Dropdown} from "react-bootstrap";
import complete0 from '../../../assets/images/complete0.svg'
import complete0_act from '../../../assets/images/complete0_act.svg'
import complete100 from '../../../assets/images/complete100.svg'
import complete100_act from '../../../assets/images/complete100_act.svg'
import complete15 from '../../../assets/images/complete15.svg'
import complete15_act from '../../../assets/images/complete15_act.svg'
import complete20 from '../../../assets/images/complete20.svg'
import complete20_act from '../../../assets/images/complete20_act.svg'
import complete25 from '../../../assets/images/complete25.svg'
import complete25_act from '../../../assets/images/complete25_act.svg'
import complete35 from '../../../assets/images/complete35.svg'
import complete35_act from '../../../assets/images/complete35_act.svg'
import complete45 from '../../../assets/images/complete45.svg'
import complete45_act from '../../../assets/images/complete45_act.svg'
import complete5_10 from '../../../assets/images/complete5_10.svg'
import complete5_10_act from '../../../assets/images/complete5_10_act.svg'
import complete65 from '../../../assets/images/complete65.svg'
import complete65_act from '../../../assets/images/complete65_act.svg'
import complete85 from '../../../assets/images/complete85.svg'
import complete85_act from '../../../assets/images/complete85_act.svg'
import complete90 from '../../../assets/images/complete90.svg'
import complete90_act from '../../../assets/images/complete90_act.svg'
import {signOutUser} from "../requests/axios_requests";
import Button from "./Button";
import SweetAlert from "./SweetAlert";

const Menu = ({className = '', data, steps, draft, handleSaveDraft, isResult = false}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(false);
  const dropdownRef = useRef(null);
  const alertTitleLogout = "<div class='text-black'>Are you sure you <br/>  want to log out?</div>"
  const id = data?.response?.id
  const lastStep = isResult ? 'results' : steps[steps.length - 1];
  const isLastStepDisabled = ['emotion-entry', 'emotion-selection-web', 'results', 'rather-not-say', 'skip-ahead'].includes(lastStep);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveImg(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setShowModal(true);
  }
  const btnElement = document.getElementsByClassName("dropdown")

  const handleChangeImg = () => {
    if (btnElement[0]?.classList.contains('show')) {
      setActiveImg(false)
    } else {
      setActiveImg(true)
    }
  };

  const location = window.location.href;
  const lastSegment = isResult ? 'results' : location.substring(location.lastIndexOf("/") + 1);
  const isStepUnsubscribe = location.substring(location.lastIndexOf("/") + 1) === 'unsubscribe'

  const segmentsMap = {
    'emotion-selection-web': {src: complete0, activeSrc: complete0_act, percent: 0},
    'emotion-entry': {src: complete5_10, activeSrc: complete5_10_act, percent: 5},
    'emotion-type': {src: complete5_10, activeSrc: complete5_10_act, percent: 5},
    'meme-selection': {src: complete5_10, activeSrc: complete5_10_act, percent: 10},
    'selected-giphy-follow': {src: complete15, activeSrc: complete15_act, percent: 15},
    'emotion-intensity': {src: complete20, activeSrc: complete20_act, percent: 20},
    'rather-not-say': {src: complete20, activeSrc: complete20_act, percent: 20},
    'skip-ahead': {src: complete20, activeSrc: complete20_act, percent: 20},
    'productivity-check': {src: complete25, activeSrc: complete25_act, percent: 25},
    'productivity-bad-follow-up': {src: complete35, activeSrc: complete35_act, percent: 35},
    'causes-to-celebrate': {src: complete45, activeSrc: complete45_act, percent: 45},
    'recognition': {src: complete65, activeSrc: complete65_act, percent: 65},
    'icebreaker-answer': {src: complete85, activeSrc: complete85_act, percent: 85},
    'icebreaker-question': {src: complete90, activeSrc: complete90_act, percent: 90},
    'results': {src: complete100, activeSrc: complete100_act, percent: 100},
    'result-managers': {src: complete100, activeSrc: complete100_act, percent: 100},
  };

  const getSrcMenu = (lastSegment, activeImg) => {
    if (isStepUnsubscribe) {
      return {
        src: activeImg ? complete0_act : complete0,
      };
    } else if (segmentsMap[lastSegment]) {
      const {src, activeSrc, percent} = segmentsMap[lastSegment];
      return {
        src: activeImg ? activeSrc : src,
        percent: percent,
      };
    } else {
      return "";
    }
  };

  return (
    <div className={`${className}`}>
      <Dropdown onClick={handleChangeImg} ref={dropdownRef}>
        <Dropdown.Toggle id='dropdown-stick' className={"rounded-circle bg-light border-0"}>
          <img src={getSrcMenu(lastSegment, activeImg).src} alt='complete'/>
        </Dropdown.Toggle>
        <Dropdown.Menu className={"mt-5 border border-1 border-color"}>
          <Dropdown.Item href="#">
            <Button
              className={`btn-item-menu mx-auto my-auto${draft || isLastStepDisabled ? ' disabled-btn-draft' : ''}`}
              disabled={draft || isLastStepDisabled} onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </Dropdown.Item>
          <Dropdown.Item href="#">
            <Button className='btn-item-menu mx-auto my-auto' onClick={handleSignOut}>
              Log Out
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {!isStepUnsubscribe && (
        <div className='fs-6 text-primary mt-1'>{getSrcMenu(lastSegment).percent}% complete</div>
      )}
      {showModal && (
        <SweetAlert
          alertTitle={alertTitleLogout}
          cancelButtonText="No, go back"
          confirmButtonText="Yes, log out"
          onConfirmAction={() => {
            signOutUser(id).then(() => window.location.href = `/sign_in`);
          }}
          onDeclineAction={() => {
            setShowModal(false);
          }}
          cancelButtonClass='btn-logout-no'
          confirmButtonClass='btn-logout-yes'
        />
      )}
    </div>
  );
};

export default Menu;