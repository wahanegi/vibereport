import React, {useEffect, useState} from 'react';
import ShoutoutIcon from '../../../assets/./sys_svg/shoutoutNew.svg'
import {NavLink} from "react-router-dom";
import ShoutoutModalNew from "./ShoutoutModalNew";

const ShoutoutButton = ({numShoutouts, moveShoutout = false}) => {
    const [shoutOutForm, setShoutOutForm] = useState(false)
    const [blink, setBlink] = useState('')
    useEffect(()=>{
        if (!numShoutouts && moveShoutout){
            setTimeout(()=>{
                setBlink('blink')
            },2000)
        }
    },[])

    const clickHandling = () => {
        setShoutOutForm(true)
    }

    const closeHandling = () => {
        setShoutOutForm(false)
    }

    const style = `left-bottom-corner ${ moveShoutout && ('into-centerX' + (!numShoutouts ? '2_5' : '')) } ${blink}`
    return (
        <div>
        {shoutOutForm && <ShoutoutModalNew onClose={closeHandling}/>}
      <div>
        <NavLink className ={style}  to={'#'}>
            <img src={ShoutoutIcon} alt='Shoutout' onClick={clickHandling}/>
        </NavLink>
      </div>
        </div>
    );
}

export default ShoutoutButton;