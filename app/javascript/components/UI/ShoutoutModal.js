import React, {Fragment, useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import xClose from '../../../assets/sys_svg/x-close.svg'
import parse from "html-react-parser";
import {Dropdown} from "react-bootstrap";
import Button from "./Button";
import DropDownList from "./DropDownList";
import Cursor from "../helpers/library";

const ShoutoutModal = ({onClose, value="<span><span style='color: #D7070A'>@</span>Team2</span>"}) => {
  const [enteredValue, setEnteredValue] = useState('')
  const textAreaRef = useRef('')
  const [users, setUsers] = useState([
    { id: 1, first_name: 'John', last_name: 'Washington' },
    { id: 2, first_name: 'Jackie', last_name: 'Chan' },
    { id: 3, first_name: 'Janice', last_name: 'Wednesday'},
    { id: 4, first_name: 'Kara', last_name: 'Friday'},
    { id: 5, first_name: 'Kieran', last_name: 'Roomie'},
    { id: 6, first_name: 'Mike', last_name: 'Snider'},
    { id: 7, first_name: 'Marina', last_name: 'Harasko'},
    { id: 8, first_name: 'Serhii', last_name: 'Borozenets'},
    // other users...
  ])
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [inputValue, setInputValue] = useState('')
  const [ toggle, setToggle ] = useState(false)
  const [index, setIndex] = useState (0)
  const [current, setCurrent] = useState(users[index].id)
  const [chosenUser, setChosenUser] = useState([])
  const [backspace, setBackspace] = useState(false)
  const [caret, setCaret] = useState(0)

    const setCaretPosition = ( position, element = textAreaRef.current) => {
      const range = document.createRange();
      const sel = window.getSelection();
      console.log("36", element, element.childNodes[0])
      range.setStart(element.childNodes[0], position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      element.focus();
    }

  const BackDrop = ({onClose}) => {
    return <div className='backdrop' onClick={onClose}>
    </div>
  }

  const ModalOverlay = ({onClose}) =>{
    const  handleKeyDown = (e) =>{
      console.log("e.key", e.key, toggle)
      const selection = window.getSelection()
      console.log("52 event",e)
      // console.log('Cursor position', Cursor.getCurrentCursorPosition(textAreaRef.current))
      if (toggle) {
        if(e.key === 'Escape' || e.key === '@') {

          console.log("58 e.target.innerHTML",e.target.innerHTML)
          e.target.innerHTML = "@"
          console.log("60 e.target.innerHTML",e.target.innerHTML)
          setToggle(false)
          e.preventDefault()
          setEnteredValue('@')
          return
        }
        if (!!(String.fromCharCode(e.keyCode)).match(/[A-Za-z0-9]/)) {
          const value = (inputValue + e.key).toLowerCase()
          console.log("56 value=",value)
          setInputValue(value)
            let filtered = users.filter(user =>
              (user.first_name + " " + user.last_name).toLowerCase().includes(value)
            )
          filtered.length !== 0 ? setFilteredUsers(filtered) : setFilteredUsers(filtered = users)
          setCurrent(filtered[0])
          setIndex(0)
          e.target.innerHtml = "<span class=\'color-primary\'>"+ "@"+String.fromCharCode(e.keyCode)+"</span>"
          e.preventDefault()
          // return
        }
        let i = index
        if (e.key === 'Enter' || e.keyCode === 32) {
          setChosenUser([...chosenUser, {id:filteredUsers[i].id, firstLastName: filteredUsers[i].first_name + " " + filteredUsers[i].last_name}])
          console.log(chosenUser)
          setToggle(false)
          let val = e.target.innerHTML
          let positionStart = val.indexOf("<span class='color-primary'>@</span>") + 30
          let positionEnd = val.indexOf('</span>', positionStart)
          e.target.innerHTML = val.slice(0,positionStart)+
            filteredUsers[i].first_name + " " + filteredUsers[i].last_name +
            val.slice(positionEnd) + '&nbsp;&#32  '
          setEnteredValue(e.target.innerHTML)
          setCaret(e.target.innerText.length)
          // console.log(" e.target.innerHTML with @ = ",  e.target.innerHTML)
          setFilteredUsers(users)
          setInputValue('')
          e.preventDefault()
          return
        }
        if ( (e.key === 'ArrowDown' || e.key === 'Tab')&& index >= 0 ) {
          setIndex(i = index < filteredUsers.length - 1 ? ++i : 0)
          setCurrent(filteredUsers[i].id)
          e.preventDefault()
          return
        }
        if ( e.key === 'ArrowUp' && index >= 0 ) {
          setIndex(i = index > 0 ? --i : filteredUsers.length - 1)
          setCurrent(filteredUsers[i].id)
          e.preventDefault()
          return
        }
      } else {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          // console.log(" Backspace selection =", selection, selection.baseOffset, selection.focusOffset)
          if (selection.focusNode.textContent.startsWith('@')) {
            console.log(selection.focusNode.textContent, chosenUser)
            let findUser = chosenUser.find((el) => ('@' + el.firstLastName) === selection.focusNode.textContent)
            if (!!findUser) {
              console.log("findUser:", findUser)
              setChosenUser(chosenUser.filter(user => user.id !== findUser.id))
              let val = e.target.innerHTML
              let positionStart = e.target.innerHTML.indexOf(findUser.firstLastName)
              let positionEnd = positionStart + findUser.firstLastName.length + '</span>'.length
              e.target.innerHTML = val.slice(0, positionStart - "<span class='color-primary'>@".length) + val.slice(positionEnd)
              setFilteredUsers(users)
              setInputValue('')
              setCaret(0)
              setEnteredValue(e.target.innerHTML)
              console.log("positionStart", positionStart)
              Cursor.setCurrentCursorPosition(2, textAreaRef.current)
              //positionStart-"<span class='color-primary'>@".length,
              e.preventDefault()
            }
          }
        }

        if (!!(String.fromCharCode(e.keyCode)).match(/[A-Za-z0-9]/)) {
          if (selection.focusNode.textContent.startsWith('@')) {
            console.log("110", selection.focusNode.textContent, chosenUser)
            // setToggle(true)
            // e.preventDefault()
            console.log('116', e.target.children[0].nodeName)
          }
        }

        if (e.key === 'Enter') {
          //something act to save to db
          e.target.innerHTML += "<br>"
          e.preventDefault()
          return
        }

        if (e.key === '@') {
          let cursor = Cursor.getCurrentCursorPosition(textAreaRef.current)
          let text = textAreaRef.current.textContent
          let lenText = text.length
          console.log("153 text, lenText, text[lenText-1], cursor.charCount ", "|"+ text +"|", lenText, "|"+text[lenText-1]+"|", cursor.charCount, cursor.charCount === lenText , text.charCodeAt(lenText-1))
          if (lenText === 0
            || (cursor.charCount === lenText && (text.charCodeAt(lenText-1) === 160||text.charCodeAt(lenText-1) ===32))
            || (cursor.charCount < lenText && (text.charCodeAt(cursor.charCount-1) === 160 && text.charCodeAt(cursor.charCount+1) ===32))
          ) {
            setToggle(true)
          } else { return }
          e.preventDefault()
          console.log("159 toggle:", toggle)
          const arr = e.target.innerHTML.split('&nbsp;')
          const val = arr.join(' ')
          console.log(arr, val)
          e.target.innerHTML = val.slice(0, selection.baseOffset) +
            "<span class=\'color-primary\'>@</span>" +
            val.slice(selection.baseOffset)
          setEnteredValue(e.target.innerHTML)
          console.log(" e.target.innerHTML with @ = ", e.target.innerHTML)
          setCaret(cursor.charCount+1)
          e.preventDefault()
        }
        if (e.key === " " || e.key.length === 1) {
          let cursor = Cursor.getCurrentCursorPosition(textAreaRef.current)
          if (cursor.focusNode.parentNode.nodeName ==='SPAN' && cursor.focusOffset === 0 && cursor.charCount === 0){
            let newHtml = e.key + "&nbsp;" + e.target.innerHTML
            setEnteredValue(newHtml)
            // textAreaRef.ref = newHtml
            e.key === " " ? setCaret(cursor.charCount) : setCaret(cursor.charCount + 1)

            e.preventDefault(cursor.charCount+1,textAreaRef.current)
          } else if (cursor.focusNode.parentNode.nodeName ==='SPAN') {
            setCaret(cursor.charCount-cursor.focusOffset+1)
            setToggle(true)
            e.preventDefault()
          }
          // e.target.attributes[2].value = "11"
          // e.target.innerHTML += `<span style='color: black'>&nbsp;</span>`
          // setEnteredValue(e.target.innerHTML)
          // e.preventDefault()
        }
      }
    }

    const changeHandling = (e) =>{
      // console.log(e, "e.key = ", e.key, e.target.value)
      // console.log(" e.target.innerHTML = ",  e.target.innerHTML)
      // console.log(" e.target.innerText = ",  e.target.innerText)
      // console.log(" enteredValue = ",  enteredValue)
      //
      // const selection = window.getSelection()
      // console.log("selection.baseOffset=", selection.baseOffset)
      // console.log("2 textAreaRef.current.innerText", textAreaRef.current.innerText)
      //
      // // setCaretPosition(textAreaRef, caret)
      // console.log("156",textAreaRef)
      // // setCaretPosition(0)
    }
    const  save = (e) =>{
      console.log(e)
    }

    useEffect(() => {
      const textArea = textAreaRef.current
      if (textArea) {
        console.log("184",textArea, enteredValue)
    //     Cursor.setCurrentCursorPosition(textArea.innerText.length, textArea)
        textArea.focus()
        const range = document.createRange()
        range.selectNodeContents(textArea)
        range.collapse(false)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        Cursor.setCurrentCursorPosition(caret, textArea)
        //
        // let pos = 0;
        //   const newPos = textArea.selectionStart;
        //   if (newPos !== pos) {
        //     console.log('195 change to new position ' + newPos);
        //     pos = newPos;
            //target.childNodes - target.childNodes.length - target.childElementCount
            //https://javascript.plainenglish.io/how-to-work-with-selection-cursor-175dfe7d8be6
          // }
      }
    }, [caret])

    const clickHandling = (e) =>{
      const element = textAreaRef.current
      const cursor = Cursor.getCurrentCursorPosition(element)
      console.log("mouseEnterHandling", cursor)
      if (cursor.focusNode.parentNode.nodeName === 'SPAN'){
        setToggle(true)
        Cursor.setCurrentCursorPosition(cursor.charCount-cursor.focusNode.textContent.length, element)
      }
    }

    const keyUpHandling = (e) =>{
      const element = textAreaRef.current
      // console.log("keyUpHandling",Cursor.getCurrentCursorPosition(element))
      if (Cursor.getCurrentCursorPosition(element)===16) {setToggle(true)}
    }

    //    <span style={{color: '#D7070A'}}>@</span>Team2    onBlur={save}
    return <Fragment>
      <img src={xClose} className='position-absolute x-close mt' onClick={onClose}/>
      <div className='col-8 offset-2 position-absolute mt-327 d-flex justify-content-center'>
              <div id='textarea'
                   contentEditable={true}
                   suppressContentEditableWarning = {true}
                   onKeyDown={handleKeyDown}
                   onKeyUp={keyUpHandling}
                   onInput={changeHandling}
                   onClick={clickHandling}
                   ref={textAreaRef}
                   value=''
                   data-testid="editable-div"
                   className='c3 place-size-shout-out form-control text-start d-inline-block'>
                {parse(enteredValue)}
              </div>
           </div>
      {toggle && <DropDownList dataList={filteredUsers} current={current}/>}

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