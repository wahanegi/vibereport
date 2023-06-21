import React, {Fragment,  useState} from 'react'
import ReactDOM from 'react-dom'
import RichInputElement from "./rich-text/RichInputElement";
import {apiRequest} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helpers";
import Portal from "./modal/Portal";
import Alert from "./modal/Alert";

const ShoutoutModal = ({ onClose, data, setData: setDataInDB, editObj = {} }) => {
  const [isNotAlert, setIsNotAlert] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [richText, setRichText] = useState(isEmpty(editObj) ? '' : editObj.rich_text)

  const ModalOverlay = () =>{
    const  idEditText =  isEmpty(editObj) ? null : editObj.id
    const submitHandling = ({richText, chosenUsers}) => {
      const dataSend = {
        shoutout:{
          user_id: data.current_user_id,
          time_period_id: data.time_period.id,
          rich_text: richText
        },
        recipients: chosenUsers.map(user => user.id)}
      const dataFromServer = ( createdUpdatedShoutOut ) =>{
        let  currentShoutOuts  = data.user_shoutouts

        if ( idEditText ) {
          currentShoutOuts = currentShoutOuts.filter( item => item.id !== idEditText )
        }

        setDataInDB({...data,
          user_shoutouts: [...currentShoutOuts, createdUpdatedShoutOut]
        })

        onClose()
      }

      setRichText(richText)

      idEditText === null
          ? apiRequest("POST", dataSend, dataFromServer, ()=>{}, "/api/v1/shoutouts")
              .catch( handlingErrors )
          : apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, "/api/v1/shoutouts/" + idEditText)
              .catch( handlingErrors )
    }
    const handlingErrors = (errors) => {
      if ( errors.response.data.error.rich_text?.length ) {
        setErrorMessage( errors.response.data.error.rich_text[0] )
        setIsNotAlert(false)
      }
    }

    const closeAlert = () => {
      setIsNotAlert(true)
    }

    return <div>
      <RichInputElement
            richText = { richText }
           listUsers = { data.users.filter(user => user.id !== data.current_user.id) }
             onClose = { onClose }
            onSubmit = { submitHandling }
    />
      {!isNotAlert && <Alert onClose={ closeAlert } errorMessage={ errorMessage }/>}
    </div>
  }


  return <Portal onClose={ onClose } modalOverlay={ <ModalOverlay/> } />
};

export default ShoutoutModal;