import React, {useEffect, useState} from 'react';
import {Dropdown} from "react-bootstrap";
import Button from "./Button";
import {signOutUser} from "../requests/axios_requests";
import SweetAlert from "./SweetAlert";

const Menu = ({ percent_completion, addClass = '', saveDataToDb, steps }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSaveDraft = () => {
    console.log('draft', steps)
    saveDataToDb( steps, {draft: true})
  }

  const handleSignOut = () => {
    setShowModal(true);
  }

  return (
    <div className={`${addClass}`}>
      <Dropdown>
        <Dropdown.Toggle  id='dropdown-stick'>
        <div  className="menu">
          <div  className="m-cover"></div>
          <div className='one-line-menu'></div>
          <div className='one-line-menu'></div>
          <div className='one-line-menu'></div>
        </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1 mx-auto my-auto' onClick={()=>{}}>Manage Profile</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={handleSaveDraft}>Save Draft</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={handleSignOut}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className='fs-6 text-primary' style={{margin: 19+"px 0 0 0"}}>{percent_completion}% complete</div>
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