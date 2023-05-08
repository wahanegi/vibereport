import React, {Fragment,  useState} from 'react'
import ReactDOM from 'react-dom'
import RichInputElement from "./rich-text/RichInputElement";
import {apiRequest} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helpers";

const ShoutoutModal = ({ onClose, data, setData: setDataInDB, editObj = {} }) => {

  const BackDrop = () => {
    return <div className='backdrop' onClick={ onClose }/>
  }

  const ModalOverlay = () =>{
    const [ richText ] = useState( isEmpty(editObj) ? '' : editObj.rich_text )
    const [ idEditText ] =  useState( isEmpty(editObj) ? null : editObj.id )
    const submitHandling = ({richText, chosenUsers}) => {
      const dataSend = {
        shoutout:{
          user_id: data.current_user_id,
          time_period_id: data.time_period.id,
          rich_text: richText,
          recipients: chosenUsers.map(user => user.id)
        }}
      const dataFromServer = ( createdUpdatedShoutOut ) =>{
        let  currentShoutOuts  = data.my_shout_outs_to_other

        if ( idEditText ) {
          currentShoutOuts = currentShoutOuts.filter( item => item.id !== idEditText )
        }

        setDataInDB({...data,
          my_shout_outs_to_other: [...currentShoutOuts, createdUpdatedShoutOut]
        })

        onClose()
      }

      idEditText === null
          ? apiRequest("POST", dataSend, dataFromServer, ()=>{}, "/api/v1/shoutouts")
              .catch(error => {alert( error.response.data.error )})
          : apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, "/api/v1/shoutouts/" + idEditText)
              .catch(error => {alert( error.response.data.error )})
    }
    return <RichInputElement
            richText = { richText }
           listUsers = { data.users.filter(user => user.id !== data.current_user_id) }
             onClose = { onClose }
            onSubmit = { submitHandling }
    />
  }

  const portalElement = document.getElementById('overlays')

  return (
    <Fragment>
      {ReactDOM.createPortal(<BackDrop onClose={ onClose }/>, portalElement)}
      {ReactDOM.createPortal(<ModalOverlay />, portalElement)}
    </Fragment>
  );
};

export default ShoutoutModal;