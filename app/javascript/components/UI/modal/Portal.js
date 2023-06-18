import React, {Fragment} from 'react';
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";

const Portal = ({onClose, modalOverlay, elementId = 'overlays' }) => {

    const portalElement = document.getElementById(elementId)
console.log(elementId, portalElement)
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose = { onClose }/>, portalElement)}
            {ReactDOM.createPortal( modalOverlay, portalElement)}
        </Fragment>
    );
};

export default Portal;