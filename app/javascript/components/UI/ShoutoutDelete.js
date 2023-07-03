import React, {Fragment} from 'react';
import ReactDOM from "react-dom";
import {apiRequest} from "../requests/axios_requests";
import Portal from "./modal/Portal";
import MessageYesNoOk from "./modal/MessageYesNoOk";

const ShoutoutDelete = ({ onClose, data, setData: setDataInDB, idShoutout}) => {

  const handlingDeleting = () => {
    const dataFromServer = (callback) =>{
      if (callback.message === 'success') {
        setDataInDB({...data,
          user_shoutouts: data.user_shoutouts.filter( item => item.id !== parseInt(idShoutout))
        })
      }
      onClose()
    }
    apiRequest("DELETE", "", dataFromServer, ()=>{}, `/api/v1/shoutouts/${idShoutout}`)
      .catch( handlingErrors )
  }
  
    const handlingErrors = (errors) => {
        if (errors.response.data.error?.length) alert( errors.response.data.error)
    }


  return <Portal onClose={ onClose }
                 modalOverlay={<MessageYesNoOk content="Delete this Shoutout?"
                                               onClick={ handlingDeleting }
                                               onClose = { onClose }/>} />
};

export default ShoutoutDelete;