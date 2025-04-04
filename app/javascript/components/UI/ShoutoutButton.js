import React, {useEffect, useState} from 'react';
import ShoutoutModal from "../Pages/modals/ShoutoutModal";
import ShoutoutIcon from '../../../assets/images/sys_svg/shoutout-new.svg'
import {NavLink} from "react-router-dom";

const ShoutoutButton = ({ data, setData,  num = 0, isMove = false, hideShoutout}) => {
  if (hideShoutout) return null;

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

  const style = isMove ? `left-bottom-corner ${ isMove && ('into-centerX' + (!num ? '2_5' : '')) } ${blink}` : ''

  return (
    <div>
      {shoutOutForm &&
        <ShoutoutModal shoutOutForm={shoutOutForm}
                       setShoutOutForm={setShoutOutForm}
                       data={data}
                       setData={setData} />
      }
      <div>
        <NavLink className ={style}  to = {'#'}>
          <img src={ShoutoutIcon} alt = 'Shoutout' onClick={clickHandling}/>
        </NavLink>
      </div>
    </div>
  );
}

export default ShoutoutButton;