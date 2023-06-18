import React, {Fragment} from 'react';
import ReactDOM from "react-dom";
import {apiRequest} from "../requests/axios_requests";

const ShoutoutDelete = ({ onClose, data, setData: setDataInDB, idShoutout}) => {
  const Backdrop = (props) => {
    return <div className='backdrop' onClick={ props.onClose }/>
  }

  const handlingDeleting = () => {
    const dataFromServer = ( deletedShoutOut ) =>{
      setDataInDB({...data,
        user_shoutouts: data.user_shoutouts.filter( item => item.id !== deletedShoutOut.id)
      })
      onClose()
    }

    apiRequest("DELETE", "", dataFromServer, ()=>{}, `/api/v1/shoutouts/${idShoutout}`)
        .catch( handlingErrors )
  }
  
    const handlingErrors = (errors) => {
        if (errors.response.data.error?.length) alert( errors.response.data.error)
    }

  const MessageContent = () =>{
    return <div className = 'placement-modal-message'>
      <div className='mt-8 fs-2' >Delete this Shoutout?</div>
      <div className='mt-6 d-flex justify-content-around'>
        <button className='btn btn-modal c1 back' onClick = { onClose }>No, go back</button>
        <button className='btn btn-modal c1 delete' onClick = { handlingDeleting } >Yes, delete</button>
      </div>
    </div>
  }

  const portalElement = document.getElementById('overlays')

  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose = { onClose }/>, portalElement)}
      {ReactDOM.createPortal(<MessageContent/>, portalElement)}
    </Fragment>
  );
};

export default ShoutoutDelete;