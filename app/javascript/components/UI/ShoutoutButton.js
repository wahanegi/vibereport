import React, { useState } from 'react';
import ShoutoutModal from "./ShoutoutModal";
import ShoutoutIcon from '../../../assets/images/sys_svg/shoutout-new.svg'

const ShoutoutButton = ({ data, setData, hideShoutout }) => {
    if (hideShoutout) return;

    const [shoutOutForm, setShoutOutForm] = useState(false)

    return <>
        <button className="border-0 bg-transparent" onClick={() => setShoutOutForm(true)}>
            <img src={ShoutoutIcon} alt='Shoutout' />
        </button>

        {shoutOutForm && <ShoutoutModal
            onClose={() => setShoutOutForm(false)}
            data={data}
            setData={setData} />}
    </>
}

export default ShoutoutButton;
