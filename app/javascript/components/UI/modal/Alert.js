import React from 'react';
import Portal from "./Portal";
import MessageYesNoOk from "./MessageYesNoOk";

const Alert = ({ onClose, errorMessage }) => {
    console.log(errorMessage)
    return <Portal onClose={ onClose }
                   modalOverlay={ <MessageYesNoOk isNoYesIsNotOk= { false }
                                                  onClose={ onClose }
                                                  onClick={ onClose }
                                                  content={ errorMessage } /> }
                   elementId = 'alert'/>
}

export default Alert;