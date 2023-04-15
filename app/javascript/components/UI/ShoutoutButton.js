import React from 'react';
import ShoutoutIcon from '../../../assets/./sys_svg/shoutout.svg'
import {NavLink} from "react-router-dom";

const ShoutoutButton = () => {
    return (
        <NavLink style={{position: 'absolute', left: 45, top:756 }} to={'#'}>
            <img src={ShoutoutIcon} alt='Shoutout'/>
        </NavLink>
    );
}

export default ShoutoutButton;