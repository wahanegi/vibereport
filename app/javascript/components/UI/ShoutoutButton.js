import React, {useState} from 'react';
import ShoutoutModal from "./ShoutoutModal";
import {ShoutOutIcon} from "./ShareContent";

const ShoutoutButton = ({ data, setData }) => {
    const [ shoutOutForm, setShoutOutForm ] = useState(false)

    const clickHandling = () => {
        setShoutOutForm(true)
    }

    const closeHandling = () => {
        setShoutOutForm(false)
    }

    return (
        <div>
            {shoutOutForm &&
                <ShoutoutModal onClose = { closeHandling }
                                  data = { data }
                               setData = { setData } />}
            <ShoutOutIcon addClass={'hud shoutout'} onClick={clickHandling} />
        </div>
    );
}

export default ShoutoutButton;