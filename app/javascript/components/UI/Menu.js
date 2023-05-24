import React, {useState, useEffect, useRef} from 'react';
import {Dropdown} from "react-bootstrap";
import Button from "./Button";
import {signOutUser} from "../requests/axios_requests";
import SweetAlert from "./SweetAlert";
import complete0 from '../../../assets/images/complete0.svg'
import complete0_act from '../../../assets/images/complete0_act.svg'
import complete5_10 from '../../../assets/images/complete5_10.svg'
import complete5_10_act from '../../../assets/images/complete5_10_act.svg'
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
import complete65 from '../../../assets/images/complete65.svg'
import complete65_act from '../../../assets/images/complete65_act.svg'
import complete85 from '../../../assets/images/complete85.svg'
import complete85_act from '../../../assets/images/complete85_act.svg'
import complete90 from '../../../assets/images/complete90.svg'
import complete90_act from '../../../assets/images/complete90_act.svg'
import complete100 from '../../../assets/images/complete100.svg'
import complete100_act from '../../../assets/images/complete100_act.svg'


const Menu = ({ addClass = '', saveDataToDb, steps, draft, handleSaveDraft }) => {
  const [showModal, setShowModal] = useState(false);
  // const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


  const handleSignOut = () => {
    setShowModal(true);
  }

  // const handleDropdownToggle = () => {
  //   setIsDropdownExpanded(!isDropdownExpanded);
  // };

  // const buttonRef = useRef(null);
  //
  // useEffect(() => {
  //   const buttonElement = buttonRef.current;
  //   if (buttonElement) {
  //     setIsExpanded(buttonElement.getAttribute('aria-expanded') === 'true');
  //   }
  // }, []);

  // const handleDropdownToggle = () => {
  //   setIsExpanded(!isExpanded);
  //   console.log('buttonRef', !isExpanded);
  // };
  // console.log('buttonRef', isExpanded);

  // console.log(buttonElement)
 // // document.addEventListener()
  useEffect(() => {
    console.log(isDropdownVisible);
  }, [isDropdownVisible]);

  const handleToggle = (isOpen) => {
    console.log("Toggle event:", isOpen);
    setIsDropdownVisible(isOpen);
  };

  const location = window.location.href;
  const lastSegment = location.substring(location.lastIndexOf("/") + 1);

  const getSrcMenu = (lastSegment) => {
    switch (lastSegment) {
      case 'emotion-selection-web':
        return {
          src: complete0,
          percent: 0,
        };
      case 'emotion-entry':
        return {
          src: complete5_10,
          percent: 5,
        };
      case 'meme-selection':
        return {
          src: complete5_10,
          percent: 10,
        };
      case 'selected-giphy-follow':
        return {
          src: complete15,
          percent: 15,
        };
      case 'emotion-intensity':
        return {
          src: complete20,
          percent: 20,
        };
      case 'productivity-check':
          return {
            src: complete25,
            src_act: complete25_act,
            percent: 25,
          }
      case 'productivity-bad-follow-up':
        return {
          src: complete35,
          percent: 35,
        };
      case 'causes-to-celebrate':
        return {
          src: complete45,
          percent: 45,
        };
      //TODO check after the merge to master branch
      case 'ShoutoutModalExample':
        return {
          src: complete65,
          percent: 65,
        };
      case 'icebreaker-answer':
        return {
          src: complete85,
          percent: 85,
        };
      case 'icebreaker-question':
        return {
          src: complete90,
          percent: 90,
        };
        //TODO check after the merge to master branch
      case 'results':
        return {
          src: complete100,
          percent: 100,
        };
      //   if (draft) {
      //     return {
      //       src: complete0_act,
      //       percent: 0
      //     };
      //   } else {
      //     return {
      //       src: complete0,
      //       percent: 0
      //     };
      //   }
      // case 'productivity-check':
      //   if (draft) {
      //     return {
      //       src: complete25_act,
      //       percent: 25
      //     };
      //   } else {
      //     return {
      //       src: complete25,
      //       percent: 25
      //     };
      //   }
      // case 'productivity-check':
      //   if (ariaExpanded) {
      //     return {
      //       src: complete25_act,
      //       percent: 25
      //     };
      //   } else {
      //     return {
      //       src: complete25,
      //       percent: 25
      //     };
      //   }
        default:
          return "";
        }
    }

  return (
    <div className={`${addClass}`}>
      <Dropdown>
        <Dropdown.Toggle  id='dropdown-stick' onToggle={handleToggle}>
          <img src={isDropdownVisible ? getSrcMenu(lastSegment).src_act : getSrcMenu(lastSegment).src} alt='complete' />

          {/*<img src={getSrcMenu(lastSegment).src } alt='complete'/>*/}
        {/*<div  className="menu">*/}
        {/*  <div  className="m-cover"></div>*/}
        {/*  <div className='one-line-menu'></div>*/}
        {/*  <div className='one-line-menu'></div>*/}
        {/*  <div className='one-line-menu'></div>*/}
        {/*</div>*/}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/*<Dropdown.Item href="#" ><Button className='btn-item-menu wb1 mx-auto my-auto' onClick={()=>{}}>Manage Profile</Button></Dropdown.Item>*/}
          <Dropdown.Item href="#" >
            <Button className={`btn-item-menu wb1 mx-auto my-auto${draft || steps.length === 1 ? ' disabled-btn-draft' : ''}`}
                    disabled={draft || steps.length === 1} onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={handleSignOut}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className='fs-6 text-primary' style={{margin: 19+"px 0 0 0"}}>{getSrcMenu(lastSegment).percent }% complete</div>
      {showModal && (
        <SweetAlert
          alertTitle={"Are you sure you <br/>  want to log out?"}
          cancelButtonText="No, go back"
          confirmButtonText="Yes, log out"
          onConfirmAction={() => {
            signOutUser().then(() => window.location.href = `/sign_in`);
          }}
          onDeclineAction={() => {
            setShowModal(false);
          }}
          cancelButtonClass='btn-logout-modal'
          backdropClass='backdrop-logout-modal'
        />
      )}
    </div>
  );
};

export default Menu;