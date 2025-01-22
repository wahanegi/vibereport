import React, { useEffect, useState } from 'react';
import ShoutoutModal from "./ShoutoutModal";
import ShoutoutIcon from '../../../assets/images/sys_svg/shoutout-new.svg'

const ShoutoutButton = ({ data, setData, num = 0, isMove = false, hideShoutout }) => {
    if (hideShoutout) return;

    const [shoutOutForm, setShoutOutForm] = useState(false)
    const [blink, setBlink] = useState('')

    useEffect(() => {
        if (!num && isMove) {
            setTimeout(() => {
                setBlink('blink')
            }, 2000)
        }
    }, [])

    const styleButton = isMove ? `left-bottom-corner ${isMove && (`into-centerX ${!num ? '2_5' : ''}`)} ${blink}` : 'hud shoutout'

    return <>
        <button className={styleButton} onClick={() => setShoutOutForm(true)}>
            <img src={ShoutoutIcon} alt='Shoutout' />
        </button>

        {shoutOutForm && <ShoutoutModal
            onClose={() => setShoutOutForm(false)}
            data={data}
            setData={setData} />}
    </>
}

export default ShoutoutButton;
