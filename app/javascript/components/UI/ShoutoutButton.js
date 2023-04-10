import React, {useEffect, useState} from 'react';
import ShoutoutIcon from '../../../assets/./sys_svg/shoutout.svg'
import {NavLink} from "react-router-dom";

const ShoutoutButton = ({shoutoutsIntoCenterX2_5}) => {
    const [blink, setBlink] = useState(false)
    useEffect(()=>{
        if (shoutoutsIntoCenterX2_5){
            setTimeout(()=>{
                setBlink(true)
            },2000)
        }
    },[])
    return (
        <NavLink className={`left-bottom-corner ${shoutoutsIntoCenterX2_5 && 'into-centerX2_5'} ${blink && 'blink'}`} to={'#'}>
            <img src={ShoutoutIcon} alt='Shoutout'/>
        </NavLink>
    );
}

export default ShoutoutButton;