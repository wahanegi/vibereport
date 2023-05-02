import React, {Fragment,  useState} from 'react'
import ReactDOM from 'react-dom'
import RichInputElement from "./rich-text/RichInputElement";

const ShoutoutModal = ({ onClose, data }) => {

  const BackDrop = ({onClose}) => {
    return <div className='backdrop' onClick={onClose}>
    </div>
  }

  const ModalOverlay = ({onClose}) =>{
    return <RichInputElement
      richText=''
      listUsers={data.users}
      className=''
      onClose={onClose}
      setChosenUsers={()=>{}}
      setRichText={()=>{}}
    />
  }

  const portalElement = document.getElementById('overlays')

  return (
    <Fragment>
      {ReactDOM.createPortal(<BackDrop onClose={onClose}/>, portalElement)}
      {ReactDOM.createPortal(<ModalOverlay onClose={onClose}/>, portalElement)}
    </Fragment>
  );
};

export default ShoutoutModal;