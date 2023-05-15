import React, {useEffect, useState} from 'react';
import ShoutoutIcon from '../../../assets/./sys_svg/shoutoutNew.svg'
import {NavLink} from "react-router-dom";
import ShoutoutModal from "./ShoutoutModal";

const ShoutoutButton = ({ data, setData,  num = 0, className = '', isMove = false}) => {

    const [ shoutOutForm, setShoutOutForm ] = useState(false)
    const [ blink, setBlink ] = useState('')

    useEffect(()=>{
        if ( !num && isMove ){
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

    const style = className ? className : `left-bottom-corner ${ isMove && ('into-centerX' + (!num ? '2_5' : '')) } ${blink}`
    return (
        <div>
            {shoutOutForm &&
                <ShoutoutModal onClose = { closeHandling }
                                  data = { data }
                               setData = { setData } />}
            <div>
                <NavLink className ={style}  to = {'#'}>
                    <img src={ShoutoutIcon} alt = 'Shoutout' onClick={clickHandling}/>
                </NavLink>
            </div>
        </div>
    );
}

export default ShoutoutButton;