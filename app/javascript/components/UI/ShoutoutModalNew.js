import React, {Fragment,  useState} from 'react'
import ReactDOM from 'react-dom'
import RichInputElement from "./RichInputElement";

const ShoutoutModal = ({onClose, value="<span><span style='color: #D7070A'>@</span>Team2</span>"}) => {

  const [users, setUsers] = useState([
    { id: 10, first_name: 'Vitalii', last_name: 'Shevchenko'},
    { id: 11, first_name: 'Vitalii', last_name: 'Sokalo'},
    { id: 1, first_name: 'John', last_name: 'Washington' },
    { id: 2, first_name: 'Jackie', last_name: 'Chan' },
    { id: 3, first_name: 'Janice', last_name: 'Wednesday'},
    { id: 4, first_name: 'Kara', last_name: 'Friday'},
    { id: 5, first_name: 'Kieran', last_name: 'Roomie'},
    { id: 6, first_name: 'Mike', last_name: 'Snider'},
    { id: 7, first_name: 'Marina', last_name: 'Harasko'},
    { id: 8, first_name: 'Serhii', last_name: 'Borozenets'},
    { id: 9, first_name: 'Lyuba', last_name: 'Pidoshva'},
  ])



  const BackDrop = ({onClose}) => {
    return <div className='backdrop' onClick={onClose}>
    </div>
  }

  const ModalOverlay = ({onClose}) =>{
    return <RichInputElement
      richText=''
      listUsers={users}
      className=''
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