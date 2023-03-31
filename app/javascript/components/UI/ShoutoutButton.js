import React from 'react';
import ShoutoutIcon from '../../../assets/svg/shoutout.svg'
import {NavLink} from "react-router-dom";

const ShoutoutButton = () => {
  return (
    <NavLink style={{position: 'fixed', left: 45, top:756 }} to={'#'}>
      <img src={ShoutoutIcon} alt='Shoutout'/>
    </NavLink>
  );
}

export default ShoutoutButton;