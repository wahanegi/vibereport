import React, {Fragment, useEffect, useRef, useState} from 'react';
import parse from "html-react-parser";
import Cursor, {decodeSpace, encodeSpace} from "../helpers/library";
import DropDownList from "./DropDownList";
import {firstLastName} from "../helpers/library";


const RichInputElement = ({ richText = "", listUsers, className, setChosenUsers, setRichText, onSubmit ,
                            classAt = 'color-primary'}) =>{
  const [enteredHTML, setEnteredHTML] = useState(encodeSpace(richText))
  const textAreaRef = useRef(richText)
  const [filteredUsers, setFilteredUsers] = useState(listUsers)
  const [ isDropdownList, setIsDropdownList ] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [index, setIndex] = useState (0)
  const [current, setCurrent] = useState(listUsers[index].id)
  const [caret, setCaret] = useState(textAreaRef.current.length)
  const highlightAT = '<span class=\"' + classAt + '\">@'
  const endHighlightAT = '</span>'
  const [users, setUsers] = useState([])
  const nonAllowedChars =  /[,@`<>;:\/\\']/

  useEffect(() => {
    const textArea = textAreaRef.current
    // const divElement = document.getElementById('textArea');
    if (textArea) {
    const range = document.createRange()
      range.selectNodeContents(textArea)
      range.collapse(false)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      Cursor.setCurrentCursorPosition(caret, textArea)
      textArea.focus()
    }
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
    const element = textAreaRef.current
    const text = element.textContent
    const cursorPos = Cursor.getCurrentCursorPosition(element)
    const caretCur = cursorPos.charCount
    const realPos  = cursorPos.realPos
    let key = event.key
    let htmlText = ''
    event.preventDefault()

    // console.log(key, text.length, cursorPos)


    if (isDropdownList) {
      event.preventDefault()
      if(event.key === 'Escape' || event.key === '@') {
        // delete SPAN tags
        setIsDropdownList(false)
        htmlText = decodeSpace(enteredHTML)
        let value = htmlText.slice( realPos - cursorPos.focusOffset, htmlText.indexOf(endHighlightAT, realPos))
        setEnteredHTML( encodeSpace(htmlText.slice(0, realPos - cursorPos.focusOffset - highlightAT.length + 1) +
          value + htmlText.slice(htmlText.indexOf(endHighlightAT, realPos) + endHighlightAT.length )))
        setCaret(caret - cursorPos.focusOffset + value.length )
        Cursor.setCurrentCursorPosition( caret - cursorPos.focusOffset + value.length , element)
        return
      }

      let i = index
      if ( key === 'Enter' || key === 'Tab') {
        let tempUsers = users
        htmlText = decodeSpace(enteredHTML)
        const nameUserToDel = htmlText.slice(realPos-searchString.length, htmlText.indexOf(endHighlightAT, realPos))
        if ( undefined !== users.find(user => firstLastName(user) === nameUserToDel) ){
          tempUsers = users.filter(user => firstLastName(user) !== nameUserToDel)
          tempUsers = tempUsers.length === 0 ? users : tempUsers
        }
        console.log("i=", i, tempUsers, users.find(user => firstLastName(user) === firstLastName(filteredUsers[i])))

        if ( undefined !== users.find(user => firstLastName(user) === firstLastName(filteredUsers[i]))) { return }

        console.log("CHECK = ", nameUserToDel, filteredUsers[i],i)

        setEnteredHTML( encodeSpace(htmlText.slice(0, realPos - searchString.length) + firstLastName(filteredUsers[i])  +
            htmlText.slice(htmlText.indexOf(endHighlightAT, realPos))))
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

      if (!(String.fromCharCode(event.keyCode)).match(nonAllowedChars)  && event.keyCode !== 160 && key.length === 1 ) {
        const newSearchString = (searchString + event.key).toLowerCase()
        const filteredList = listUsers.filter( user => firstLastName(user).toLowerCase().startsWith(newSearchString) )
        console.log('search = ', newSearchString, filteredList)

        if ( filteredList.length === 1  && firstLastName(filteredList[0]).toLowerCase() === newSearchString ) {
          //if stringSearch === firstLastName of user and 1 element in the array than update Users and chosenUsers
          console.log(users.find(user => firstLastName(user) === newSearchString))

          if ( undefined !== users.find(user => firstLastName(user) === newSearchString)) {
            return
          } //if user having in Users then return
          htmlText = decodeSpace(enteredHTML)
          setEnteredHTML(encodeSpace(htmlText.slice(0, realPos-newSearchString.length+1) + firstLastName(filteredList[0])
            + htmlText.slice( realPos )))
          setUsers([...users, filteredList[0]])
          setChosenUsers([...users, filteredList[0]])
          setIsDropdownList(false)
          setCaret(caretCur + 1)
          setSearchString('')
        } else if( !!filteredList.length ) {
          //delete user from text, Users, ChosenUsers and put in it char
          console.log("125 filteredList=", filteredList, "enteredHTML=",enteredHTML, "realPos=", realPos, "cursorPos=", cursorPos, "users=", users)
          htmlText = decodeSpace(enteredHTML)
          console.log("128 enteredHtml=", enteredHTML, "htmlText=", htmlText)
          const oldUser = decodeSpace(
            htmlText.slice(realPos - cursorPos.focusOffset + 1, htmlText.indexOf(endHighlightAT ,realPos)) )
          console.log(oldUser, users.filter(user => firstLastName(user) !== oldUser)) //take user from text
          setUsers(users.filter(user => firstLastName(user) !== oldUser)) // delete user from Users
          setChosenUsers(users.filter(user => firstLastName(user) !== oldUser)) // delete user from ChosenUsers
          setEnteredHTML(encodeSpace(htmlText.slice(0, realPos) + encodeSpace( key ) +
            htmlText.slice(htmlText.indexOf(endHighlightAT, realPos)))) // input char from key
          setSearchString(newSearchString)
          setFilteredUsers( filteredList )
          setIndex(0)
          setCaret(caretCur + 1)
        }
        // setSearchString(newSearchString)
        setChosenUsers(listUsers.filter(item => !users.includes(item)))
      }

      if ( (key === 'ArrowDown' ) && index >= 0 ) {
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
      htmlText = decodeSpace(enteredHTML)
      if ( cursorPos.focusNode.parentNode.tagName ==='DIV' && event.key.length === 1 ) {
        event.preventDefault()
        switch (event.key) {
          case '@':
            if ( text.length === 0 || caretCur === text.length && text[caretCur - 1] === " "
              || caretCur > 0 && caretCur < text.length && text.charCodeAt(caretCur-1) === 32 && text.charCodeAt(caretCur) === 32
              || caretCur === 0 && text.length > 0 && text.charCodeAt(caretCur) === 32) {
              setEnteredHTML(htmlText.slice(0, realPos) + highlightAT + endHighlightAT + htmlText.slice(realPos))
              setIsDropdownList(true)
              setCaret(caretCur + 1)
              console.log("switch @", caret)
              return;
            } else {

            }
          default:
            setEnteredHTML(encodeSpace(htmlText.slice(0, realPos) + key + htmlText.slice(realPos)))
            setCaret(caretCur + 1)
        }
      } else if ( cursorPos.focusNode.parentNode.tagName ==='SPAN' && event.key.length === 1 ) {
        event.preventDefault()
        htmlText = decodeSpace(enteredHTML)
        const startNameUser = realPos - cursorPos.focusOffset + 1
        const endNameUser = htmlText.indexOf(endHighlightAT, realPos)
        const nameUserToDel = htmlText.slice(startNameUser, endNameUser)
        if (listUsers.find(user => firstLastName(user) === nameUserToDel) !== undefined
          && !event.key.match(/[@<>]/) && nameUserToDel.length === cursorPos.focusOffset - 1) {
          //if user have in the ListUsers and key have not chars @,<,> and cursor at the end of firstLastName of user
          //then highlight turn off
          const pos = realPos + endHighlightAT.length
          const end = pos === htmlText.length ? '' : htmlText.slice(pos)
          setEnteredHTML(encodeSpace(htmlText.slice(0,pos ) + event.key + end))
          setCaret(caret + 1)
        } else if (!event.key.match(/[,@`<>;:\\\/\s]/)){
          event.preventDefault()
          const renewUsers = users.filter(user => firstLastName(user) !== nameUserToDel)
          setUsers(renewUsers === undefined ? [] : renewUsers)
          setChosenUsers(renewUsers === undefined ? [] : [...renewUsers])
          setEnteredHTML(encodeSpace(htmlText.slice(0, startNameUser) + event.key + htmlText.slice(endNameUser)))
          setIsDropdownList(true)
          setCaret(caretCur - cursorPos.focusOffset + 2)
          setSearchString(event.key)
        }
      }

      if ( event.key.length === 1 && htmlText.length > realPos
        && htmlText.indexOf(highlightAT) === realPos && !event.key.match(/<>/)) {
        setEnteredHTML(encodeSpace(htmlText.slice(0, realPos) + key + htmlText.slice(realPos)))//
        setUsers(caret + 1)
      }

    }

    switch (key){
      case 'Home':
        setCaret ( 0 )
        break;
      case 'End':
        setCaret ( text.length )
        break;
      case 'ArrowLeft':
        setCaret ( cursorPos.charCount > 0 ? cursorPos.charCount - 1 : 0 )
        break
      case 'ArrowRight':
        setCaret ( cursorPos.charCount < text.length ? cursorPos.charCount + 1 : text.length )
        break
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
      // Cursor.setCurrentCursorPosition(cursor.charCount-cursor.focusOffset+1, element)
      setCaret(cursor.charCount )//-cursor.focusOffset+1
    }
  }

  const keyUpHandling = event => {
// if(event.key === 'Home') {
//   Cursor.setCurrentCursorPosition( 0 , textAreaRef.current )
// }
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
             id = 'textArea'
             className='c3 place-size-shout-out form-control text-start d-inline-block'>
          {parse(enteredHTML)}
        </div>
      </div>
      {isDropdownList && <DropDownList dataList={filteredUsers} current={current}/>}

    </Fragment>
  )}

export default RichInputElement;