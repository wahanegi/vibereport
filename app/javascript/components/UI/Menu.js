import React, {useEffect, useRef, useState} from 'react';
import {Dropdown} from "react-bootstrap";
import {signOutUser} from "../requests/axios_requests";
import Button from "./Button";
import SweetAlert from "./SweetAlert";
import {SEGMENTS_MAP} from "../helpers/consts";

const Menu = ({className = '', data, steps, draft, handleSaveDraft, isResult = false}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(false);
  const dropdownRef = useRef(null);
  const alertTitleLogout = "<div class='text-black'>Are you sure you <br/>  want to log out?</div>"
  const id = data?.response?.id
  const lastStep = isResult
      ? 'results'
      : Array.isArray(steps) && steps.length > 0
          ? steps.at(-1)
          : '';
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

  const getSrcMenu = (lastSegment, activeImg) => {
    if (isStepUnsubscribe) {
      return {
        src: activeImg ? SEGMENTS_MAP['emotion-selection-web'].activeSrc : SEGMENTS_MAP['emotion-selection-web'].src,
      };
    } else if (SEGMENTS_MAP[lastSegment]) {
      const {src, activeSrc, percent} = SEGMENTS_MAP[lastSegment];
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
        <Dropdown.Toggle id='dropdown-stick' className={"rounded-circle bg-white border-0 p-0"}>
          <img src={getSrcMenu(lastSegment, activeImg).src} alt='complete' className={"dropdown-img"} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={"mt-5 border border-1 border-color"}>
          <Dropdown.ItemText>
            <Button
              className={`btn-item-menu mx-auto my-auto${draft || isLastStepDisabled ? ' disabled-btn-draft' : ''}`}
              disabled={draft || isLastStepDisabled} onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </Dropdown.ItemText>
          <Dropdown.ItemText>
            <Button className='btn-item-menu mx-auto my-auto' onClick={handleSignOut}>
              Log Out
            </Button>
          </Dropdown.ItemText>
        </Dropdown.Menu>
      </Dropdown>
      {!isStepUnsubscribe && (
        <div className='text-primary text-nowrap pt-0 pt-sm-1'>
          <span>
            {getSrcMenu(lastSegment).percent}% complete
          </span>
        </div>
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