import React, {Fragment, useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import xClose from '../../../assets/sys_svg/x-close.svg'
import parse from "html-react-parser";

const ShoutoutModal = ({onClose, value="<span><span style='color: #D7070A'>@</span>Team2</span>"}) => {
  const [enteredValue, setEnteredValue] = useState('')
  const textAreaRef = useRef('')
  const [users, setUsers] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jack' },
    { id: 4, name: 'James' },
    // other users...
  ])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [inputValue, setInputValue] = useState('')


  const BackDrop = ({onClose}) => {
    return <div className='backdrop' onClick={onClose}>
    </div>
  }

  const ModalOverlay = ({onClose}) =>{
    const  handleKeyDown = (e) =>{
      console.log(e, "e.key = ", e.key, e.target.value)
      console.log(" e.target.innerHTML = ",  e.target.innerHTML)
      const selection = window.getSelection()
      console.log(selection)
      if (e.key === '@') {
        e.target.innerHTML += "<span id='user' style='color: red'>&#64;</span>&nbsp;"
        setEnteredValue(e.target.innerHTML)
        console.log(" e.target.innerHTML with @ = ",  e.target.innerHTML)
        e.preventDefault()
      }
      if (e.key === " ") {
        e.target.innerHTML += `<span style='color: black'>&nbsp;</span>`
        setEnteredValue(e.target.innerHTML)
        e.preventDefault()
      }
    }
    const  save = (e) =>{
      console.log(e)
    }

    useEffect(() => {
      const textArea = textAreaRef.current
      if (textArea) {
        textArea.focus()
        const range = document.createRange()
        range.selectNodeContents(textArea)
        range.collapse(false)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }, ['', enteredValue])

    //    <span style={{color: '#D7070A'}}>@</span>Team2    onBlur={save}
    return <Fragment>
      <img src={xClose} className='position-absolute x-close mt' onClick={onClose}/>
      <div className='col-8 offset-2 position-absolute mt-327 d-flex justify-content-center'>
              <div id='textarea'
                   contentEditable={true}
                   suppressContentEditableWarning = {true}
                   onKeyDown={handleKeyDown}
                   ref={textAreaRef}
                   value=''
                   className='c3 place-size-shout-out form-control text-start'>
                {parse(enteredValue)}
              </div>
           </div>
    </Fragment>
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