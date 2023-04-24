import React, {Fragment, useEffect, useRef, useState} from 'react';
import parse from "html-react-parser";
import Cursor from "../helpers/library";
import DropDownList from "./DropDownList";
import {firstLastName} from "../helpers/library";


const RichInputElement = ({ richText = "", listUsers, className, setChosenUsers, setRichText, onSubmit ,
                            classAt = 'color-primary'}) =>{
  const [enteredHTML, setEnteredHTML] = useState(richText)
  const textAreaRef = useRef(richText)
  const [filteredUsers, setFilteredUsers] = useState(listUsers)
  const [ isDropdownList, setIsDropdownList ] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [index, setIndex] = useState (0)
  const [current, setCurrent] = useState(listUsers[index].id)
  const [caret, setCaret] = useState(textAreaRef.current.length)
  const highlightAT = '<span class=\"'+ classAt+'\">@'
  const endHighlightAT = '</span>'
  const [users, setUsers] = useState([])
  const nonAllowedChars =  /[ ,@`<>;:\/\\']/

  useEffect(() => {
    const textArea = textAreaRef.current
    // if (textArea) {
      textArea.focus()
      const range = document.createRange()
      range.selectNodeContents(textArea)
      range.collapse(false)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      Cursor.setCurrentCursorPosition(caret, textArea)
    // }
  }, [caret])

  useEffect(()=>{
    if(richText.includes(highlightAT)){
      let users = []
      let pos = 0
      while((pos = richText.indexOf(highlightAT,pos)) !== -1){
        pos +=  + highlightAT.length
        users.push(listUsers.find(user => firstLastName(user) === richText.slice(pos, richText.indexOf(endHighlightAT, pos))))
      }
      setChosenUsers(users)
      setUsers(users)
      setChosenUsers(listUsers.filter(item => !users.includes(item)))
    }
  },[])

  const handleKeyDown = event => {
    event.preventDefault()
    const element = textAreaRef.current
    const text = element.textContent
    const cursorPos = Cursor.getCurrentCursorPosition(element)
    const caretCur = cursorPos.charCount
    const realPos  = cursorPos.realPos
    let key = event.key

    if (isDropdownList) {
      if(event.key === 'Escape' || event.key === '@') {
        setIsDropdownList(false)
        event.preventDefault()
        return
      }

      let i = index
      if ( key === 'Enter' || event.keyCode === 32) {
        let tempUsers = users
        const nameUserToDel = enteredHTML.slice(realPos-searchString.length, enteredHTML.indexOf(endHighlightAT, realPos))
        if ( undefined !== users.find(user => firstLastName(user) === nameUserToDel) ){
          tempUsers = users.filter(user => firstLastName(user) !== nameUserToDel)
          tempUsers = tempUsers === [] ? users : tempUsers
        }
        console.log("i=", i, tempUsers, users.find(user => firstLastName(user) === firstLastName(filteredUsers[i])))
        if ( undefined !== users.find(user => firstLastName(user) === firstLastName(filteredUsers[i]))) { return }
        console.log("CHECK = ", nameUserToDel, filteredUsers[i],i)
        setEnteredHTML(enteredHTML.slice(0, realPos - searchString.length) + firstLastName(filteredUsers[i])  +
          enteredHTML.slice(enteredHTML.indexOf(endHighlightAT, realPos)))
        const getUsers = [...tempUsers,
          { id:filteredUsers[i].id,
            first_name: filteredUsers[i].first_name,
            last_name: filteredUsers[i].last_name
          }]
        console.log(getUsers)
        setUsers(getUsers)
        setChosenUsers(getUsers)
        setIsDropdownList(false)
        setCaret(caret + firstLastName(filteredUsers[i]).length )
        setFilteredUsers(listUsers)
        setSearchString('')
        setIndex(0)
        return
      }

      if (!(String.fromCharCode(event.keyCode)).match(nonAllowedChars)  && event.keyCode !== 160 && key.length === 1) {
        const newSearchString = (searchString + event.key).toLowerCase()
        const filteredList = listUsers.filter( user => firstLastName(user).toLowerCase().startsWith(newSearchString) )
        console.log('search = ', newSearchString, filteredList)
        if ( filteredList.length === 1  && firstLastName(filteredList[0]).toLowerCase() === newSearchString ) {
          console.log(users.find(user => firstLastName(user) === newSearchString))
          if ( undefined !== users.find(user => firstLastName(user) === newSearchString)) { return }
          setEnteredHTML(enteredHTML.slice(0, realPos-newSearchString.length+1) + firstLastName(filteredList[0])
              + enteredHTML.slice( realPos ))
          setUsers([...users, filteredList[0]])
          setChosenUsers([...users, filteredList[0]])
          setIsDropdownList(false)
          setCaret(caretCur + 1)
          setSearchString('')
        } else if( !!filteredList.length ) {
          const oldUser = enteredHTML.slice(realPos-cursorPos.focusOffset+1, enteredHTML.indexOf(endHighlightAT ,realPos))
          console.log(oldUser, users.filter(user => firstLastName(user) !== oldUser))
          setUsers(users.filter(user => firstLastName(user) !== oldUser))
          setChosenUsers(users.filter(user => firstLastName(user) !== oldUser))
          setEnteredHTML(enteredHTML.slice(0, realPos) + event.key +
            enteredHTML.slice(enteredHTML.indexOf(endHighlightAT, realPos)))
          setSearchString(newSearchString)
          setFilteredUsers( filteredList )
          setIndex(0)
          setCaret(caretCur + 1)
        }
        // setSearchString(newSearchString)
        setChosenUsers(listUsers.filter(item => !users.includes(item)))
      }

      if ( (key === 'ArrowDown' || key === 'Tab') && index >= 0 ) {
        setIndex(i = index < filteredUsers.length - 1 ? ++i : 0)
        setCurrent(filteredUsers[i].id)
        return
      }

      if ( key === 'ArrowUp' && index >= 0 ) {
        console.log("press Enter or Space when is Dropdowm list turn on", "i=",i, "f=", filteredUsers[i])
        setIndex(i = index > 0 ? --i : filteredUsers.length - 1)
        setCurrent(filteredUsers[i].id)
        return
      }

    } else {
      if ( cursorPos.focusNode.parentNode.tagName ==='DIV' && event.key.length === 1 ) {
        switch (event.key) {
          case '@':
            if ( text.length === 0 || caretCur === text.length && text[caretCur - 1] === " "
              || caretCur > 0 && caretCur < text.length && text.charCodeAt(caretCur-1) === 32 && text.charCodeAt(caretCur) === 32
              || caretCur === 0 && text.length > 0 && text.charCodeAt(caretCur) === 32) {
              setEnteredHTML(enteredHTML.slice(0, realPos) + highlightAT + endHighlightAT + enteredHTML.slice(realPos))
              setIsDropdownList(true)
              setCaret(caretCur + 1)
              console.log("switch @", caret)
              return;
            } else {

            }
          default:
            setEnteredHTML(enteredHTML.slice(0, realPos) + event.key + enteredHTML.slice(realPos))
            setCaret(caretCur + 1)
        }
      } else if ( cursorPos.focusNode.parentNode.tagName ==='SPAN' && event.key.length === 1 ) {
        const startNameUser = realPos - cursorPos.focusOffset + 1
        const endNameUser = enteredHTML.indexOf(endHighlightAT, realPos)
        const nameUserToDel = enteredHTML.slice(startNameUser, endNameUser)
        if (listUsers.find(user => firstLastName(user) === nameUserToDel) !== undefined
            && !event.key.match(/[@<>]/) && nameUserToDel.length === cursorPos.focusOffset - 1) {
          const pos = realPos + endHighlightAT.length
          const end = pos === enteredHTML.length ? '' : enteredHTML.slice(pos)
          setEnteredHTML(enteredHTML.slice(0,pos ) + event.key + end)
          setCaret(caret + 1)
        } else if (!event.key.match(/[,@`<>;:\\\/\s]/)){
          const renewUsers = users.filter(user => firstLastName(user) !== nameUserToDel)
          setUsers(renewUsers === undefined ? [] : renewUsers)
          setChosenUsers(renewUsers === undefined ? [] : [...renewUsers])
          setEnteredHTML(enteredHTML.slice(0, startNameUser) + event.key + enteredHTML.slice(endNameUser))
          setIsDropdownList(true)
          setCaret(caretCur - cursorPos.focusOffset + 2)
          setSearchString(event.key)
        }
      }
      if ( event.key.length === 1 && enteredHTML.length > realPos
          && enteredHTML.indexOf(highlightAT) === realPos && !event.key.match(/<>/)) {
        key += " "
        setEnteredHTML(enteredHTML.slice(0, realPos) + key + enteredHTML.slice(realPos))
        setUsers(caret + 1)
      }
    }
  }

  const clickHandling = event => {
    const element = textAreaRef.current
    const cursor = Cursor.getCurrentCursorPosition(element)
    console.log("mouseEnterHandling", cursor, cursor.focusNode.textContent, enteredHTML)
    if (cursor.focusNode.parentNode.nodeName === 'SPAN'){
      filteredUsers.map((user, index) => {
        if (firstLastName(user) === cursor.focusNode.textContent.slice(1)){
          setCurrent(user.id)
          setIndex(index)
          console.log(user, index, filteredUsers)
        }
      })
      setIsDropdownList(true)
      Cursor.setCurrentCursorPosition(cursor.charCount-cursor.focusOffset+1, element)
    }
  }

  const keyUpHandling = event => {

  }

  const changeHandling = event => {

  }

  return (
    <Fragment>
        <div className='col-8 offset-2 position-absolute mt-327 d-flex justify-content-center'>
          <div contentEditable={true}
            suppressContentEditableWarning = {true}
            onKeyDown={handleKeyDown}
            onKeyUp=  {keyUpHandling}
            onInput=  {changeHandling}
            onClick=  {clickHandling}
            ref=      {textAreaRef}
            data-testid="editable-div"
            className='c3 place-size-shout-out form-control text-start d-inline-block'>
              {parse(enteredHTML)}
          </div>
        </div>
      {isDropdownList && <DropDownList dataList={filteredUsers} current={current}/>}

    </Fragment>
  )}

export default RichInputElement;