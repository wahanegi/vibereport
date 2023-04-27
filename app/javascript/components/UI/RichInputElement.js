import React, {Fragment, useEffect, useRef, useState} from 'react';
import parse from "html-react-parser";
import Cursor, {
  addSymbolsToHTMLobj,
  decodeSpace,
  decodeSpace160, decrementPositionCursor,
  deleteNextChar, deleteNode,
  deletePreviousChar, deleteString,
  encodeSpace,
  incrementPositionCursor, pasteSymbolsToHTMLobj
} from "../helpers/library";
import DropDownList from "./DropDownList";
import {userFullName} from "../helpers/library";
import RichText from "../helpers/rich-text";



const RichInputElement = ({ richText = "", listUsers, className, setChosenUsers, setRichText, onSubmit ,
                            classAt = 'color-primary'}) =>{
  const [enteredHTML, setEnteredHTML] = useState( encodeSpace(richText))
  const textAreaRef = useRef(richText)
  const [filteredUsers, setFilteredUsers] = useState(listUsers)
  const [ isDropdownList, setIsDropdownList ] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [index, setIndex] = useState (0)
  const [current, setCurrent] = useState(listUsers[index].id)
  const [caret, setCaret] = useState(textAreaRef.current.length)
  const tagAT = '<span class=\"' + classAt + '\">@'
  const endTagAT = '</span>'
  const [users, setUsers] = useState([])
  const nonAllowedChars =  /[,@`<>;:\/\\']/

  useEffect(() => {
    // const textArea = textAreaRef.current
    // if (textArea) {
    // const range = document.createRange()
    //   range.selectNodeContents(textArea)
    //   range.collapse(false)
    //   const selection = window.getSelection()
    //   selection.removeAllRanges()
    //   selection.addRange(range)
      Cursor.setCurrentCursorPosition(caret, textArea)
      // textArea.focus()
    // }
  }, [caret, enteredHTML])

  useEffect(()=>{
    if(richText.includes(tagAT)){
      let users = []
      let pos = 0
      while((pos = richText.indexOf(tagAT,pos)) !== -1){
        pos +=  + tagAT.length
        users.push(listUsers.find(user => userFullName(user) === richText.slice(pos, richText.indexOf(endTagAT, pos))))
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

    console.log(key, text.length, caretCur, realPos, isDropdownList)

    switch(key) {
      case '&':
        key='&amp;'
        break
      case '<':
        key = '&lt;'
        break
      case '>':
        key = '&rt;'
        break
    }

    if (isDropdownList) {
      event.preventDefault()
      if(event.key === 'Escape' || event.key === '@') {
        if(text[caret-1] === "@") {
          RichText.deleteNodePasteChars(enteredHTML, cursorPos, key === '@' ? '@@' : '@' , tagAT, endTagAT, setEnteredHTML, setCaret)
        }
        setIsDropdownList(false)
        return;
      }

      let i = index
      if ( key === 'Enter' || key === 'Tab') {
        let tempUsers = users
        htmlText = decodeSpace(enteredHTML)
        const nameUserToDel = decodeSpace(enteredHTML.slice(realPos-encodeSpace(searchString).length,
          enteredHTML.indexOf(endTagAT, realPos)))
//undefined !==
        if ( !!users.find(user => userFullName(user) === nameUserToDel) ){
        tempUsers = users.filter(user => userFullName(user) !== nameUserToDel)
          tempUsers = tempUsers.length === 0 ? users : tempUsers
        }
        console.log("i=", i, tempUsers, users.find(user => userFullName(user) === userFullName(filteredUsers[i])))
//undefined !==
        if ( !!users.find(user => userFullName(user) === userFullName(filteredUsers[i]))) { return }

        console.log("CHECK = ", nameUserToDel, filteredUsers[i],i , "htmlText=", htmlText)

        setEnteredHTML( encodeSpace(enteredHTML.slice(0, realPos - encodeSpace(searchString).length) +
          encodeSpace( userFullName(filteredUsers[i]) ) + enteredHTML.slice(enteredHTML.indexOf(endTagAT, realPos))))
console.log("encodeSpace(searchString).length=", encodeSpace(searchString).length,
  enteredHTML.slice(0, realPos - encodeSpace(searchString).length),
  enteredHTML.slice(enteredHTML.indexOf(endTagAT, realPos))
)
        const getUsers = [...tempUsers,
          { id:filteredUsers[i].id,
            first_name: filteredUsers[i].first_name,
            last_name: filteredUsers[i].last_name
          }]
        console.log(getUsers)
        setUsers(getUsers)
        setChosenUsers(getUsers)
        setIsDropdownList(false)
        setCaret(caret + userFullName(filteredUsers[i]).length - decodeSpace(decodeSpace160( searchString)).length)
        setFilteredUsers(listUsers)
        setSearchString('')
        setIndex(0)
        return
      }

      if (!(String.fromCharCode(event.keyCode)).match(nonAllowedChars) && key.length === 1 ) {
        const newSearchString = (searchString + event.key).toLowerCase()
        const filteredList = listUsers.filter( user => userFullName(user).toLowerCase().startsWith(newSearchString) )
        console.log('search = ', newSearchString, filteredList)

        if ( filteredList.length === 1  && userFullName(filteredList[0]).toLowerCase() === newSearchString ) {
          //if stringSearch === firstLastName of user and 1 element in the array than update Users and chosenUsers
          console.log("119",users.find(user => userFullName(user) === newSearchString))
//undefined !==
          if ( !!users.find(user => userFullName(user) === newSearchString)) {
            return
          } //if user is in Users then return
          htmlText = decodeSpace(enteredHTML)
          setEnteredHTML(encodeSpace(enteredHTML.slice(0, realPos - encodeSpace(newSearchString).length + 1) +
            encodeSpace(userFullName(filteredList[0])) + enteredHTML.slice( realPos )))
          console.log("htmlText", htmlText, "newSearchString", newSearchString,
            realPos - encodeSpace(newSearchString).length + 1,
            enteredHTML.slice(0, realPos - encodeSpace(newSearchString).length + 1),
            encodeSpace(userFullName(filteredList[0])) , enteredHTML.slice( realPos ), "realPos=", realPos)

          setUsers([...users, filteredList[0]])
          setChosenUsers([...users, filteredList[0]])
          setIsDropdownList(false)
          setCaret(caretCur + 1)
          setSearchString('')
        } else if( !!filteredList.length ) {
          //delete user from text, Users, ChosenUsers and put in it char
          // console.log("125 filteredList=", "key=", encodeSpace(key), filteredList, "enteredHTML=",enteredHTML, "realPos=", realPos, "cursorPos=", cursorPos, "users=", users)
          htmlText = decodeSpace(enteredHTML)
          // console.log("128 enteredHtml=", enteredHTML, "htmlText=", htmlText, "key=", encodeSpace(key),)
          const oldUser = decodeSpace(
            enteredHTML.slice(realPos - cursorPos.focusOffset + 1, enteredHTML.indexOf(endTagAT ,realPos))
          )
          console.log(realPos, cursorPos.focusOffset + 1, enteredHTML.indexOf(endTagAT ,realPos))
          // console.log(oldUser, "key=", encodeSpace(key), users.filter(user => firstLastName(user) !== oldUser)) //take user from text
          setUsers(users.filter(user => userFullName(user) !== oldUser)) // delete user from Users
          setChosenUsers(users.filter(user => userFullName(user) !== oldUser)) // delete user from ChosenUsers
          setEnteredHTML(encodeSpace(enteredHTML.slice(0, realPos) + encodeSpace( key ) +
            enteredHTML.slice(enteredHTML.indexOf(endTagAT, realPos)))) // input char from key
          console.log("145key=", encodeSpace(key), "charPos/realPos", cursorPos.charCount, realPos,"enteredHtml=", enteredHTML,
            "htmlText=", htmlText, "oldUser=", oldUser, 'result=',
            encodeSpace(enteredHTML.slice(0, realPos) + encodeSpace( key ) +
              enteredHTML.slice(enteredHTML.indexOf(endTagAT, realPos))),
            'search = ', newSearchString, filteredList
          )
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
        console.log("press Enter or Tab when is Dropdown list turn on", "i=",i, "f=", filteredUsers[i])
        setIndex(i = index > 0 ? --i : filteredUsers.length - 1)
        setCurrent(filteredUsers[i].id)
        return
      }

    } else {
      htmlText = encodeSpace(enteredHTML)
      console.log(htmlText)
      console.log(cursorPos.focusNode)//.parentNode.tagName
      if ( cursorPos.focusNode.parentNode.tagName ==='DIV' && event.key.length === 1 ) {
        event.preventDefault()
        switch (event.key) {
          case '@':
            console.log(htmlText, realPos)
            if ( text.length === 0 || caretCur === text.length && text[caretCur - 1] ===  "\u00A0"
              || caretCur > 0 && caretCur < text.length && text.charCodeAt(caretCur-1) === 160
                && text.charCodeAt(caretCur) === 160
              || caretCur === 0 && text.length > 0 && text.charCodeAt(caretCur) === 160) {
              // console.log("218: ",)
              // setEnteredHTML(encodeSpace(decodeSpace( htmlText ).slice(0, realPos) +
              //   highlightAT + endTagAT + decodeSpace( htmlText ).slice(realPos))
              RichText.pasteNodeToHTMLobj(
                  "@", enteredHTML, cursorPos, setEnteredHTML, setCaret, tagAT.slice(0,-1), endTagAT
              )
              setIsDropdownList(true)
              // setCaret(caretCur + 1)
              // console.log("switch @", caret)
              return;
            } else {

            }
          default:
            setEnteredHTML(encodeSpace(enteredHTML.slice(0, realPos) + key + enteredHTML.slice(realPos)))
            setCaret(caretCur + 1)
        }
      } else if ( cursorPos.focusNode.parentNode.tagName ==='SPAN' && event.key.length === 1 ) {
        event.preventDefault()
        const startNameUser = realPos - cursorPos.realFocusOffset + 1
        const endNameUser = encodeSpace( enteredHTML ).indexOf(endTagAT, realPos)
        const nameUserToDel = decodeSpace(encodeSpace( enteredHTML ).slice(startNameUser, endNameUser))
        console.log(startNameUser, endNameUser, nameUserToDel, cursorPos.focusOffset , realPos, encodeSpace( enteredHTML ))
//undefined !==
        if (!!listUsers.find(user => userFullName(user) === nameUserToDel)
          && !event.key.match(/[@<>]/) && nameUserToDel.length === cursorPos.focusOffset - 1) {
          //if user have in the ListUsers and key have not chars @,<,> and cursor at the end of firstLastName of user
          //then dropdown turn off
          const pos = realPos + endTagAT.length
          const end = pos === htmlText.length ? '' : htmlText.slice(pos)
          setEnteredHTML(encodeSpace(htmlText.slice(0,pos ) + event.key + end))
          setCaret(caret + 1)
        } else if (!event.key.match(/[,@`<>;:\\\/\s]/)){
          event.preventDefault()
          const renewUsers = users.filter(user => userFullName(user) !== nameUserToDel)
          //  === undefined
          setUsers( !renewUsers ? [] : renewUsers)
          setChosenUsers( !renewUsers ? [] : [...renewUsers])
          setEnteredHTML(encodeSpace(htmlText.slice(0, startNameUser) + event.key + htmlText.slice(endNameUser)))
          console.log(startNameUser, endNameUser, nameUserToDel,
            "|",encodeSpace(htmlText).slice(0, startNameUser),"|",
            "|",htmlText.slice(endNameUser),"|",
            encodeSpace(htmlText.slice(0, startNameUser) + event.key + htmlText.slice(endNameUser)))
          setIsDropdownList(true)
          setCaret(caretCur - cursorPos.focusOffset + 2)
          setSearchString(event.key)
        }
      }

      if ( event.key.length === 1 && htmlText.length > realPos
        && htmlText.indexOf(tagAT) === realPos && !event.key.match(/<>&/)) {
        pasteSymbolsToHTMLobj( key, htmlText, cursorPos, setEnteredHTML, setCaret )
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
        decrementPositionCursor( 1, cursorPos, setCaret )
        break
      case 'ArrowRight':
        incrementPositionCursor( 1, cursorPos, text, setCaret )
        break
    }

    if (key === 'Backspace' || key === 'Delete') {
       console.log(" Backspace selection =", cursorPos.focusNode.textContent.startsWith('@'))
      if (cursorPos.focusNode.textContent.startsWith('@')) {
        console.log(cursorPos.focusNode.textContent, users)
        let findUser = users.find((el) => ('@' + userFullName( el )) === decodeSpace160( cursorPos.focusNode.textContent ))
        if (!!findUser) {
          console.log("findUser:", findUser)
          const newListUser = users.filter(user => user.id !== findUser.id)
          setChosenUsers(newListUser)
          setUsers(newListUser)
          // console.log("newListUser:", newListUser)
          // let val = event.target.innerHTML
          RichText.deleteNode( enteredHTML, cursorPos, tagAT, endTagAT, setEnteredHTML, setCaret )
          // let positionStart = realPos - cursorPos.realFocusOffset  - highlightAT.length + 1
          // let posEnd = enteredHTML.indexOf(endTagAT, realPos ) + endTagAT.length
          // // let positionEnd = positionStart + encodeSpace( firstLastName( findUser ) ).length + '</span>'.length
          // // event.target.innerHTML = val.slice(0, positionStart - highlightAT.length) + val.slice(positionEnd)
          // setFilteredUsers(users)
          // // setInputValue('')
          // setCaret(caret - cursorPos.focusOffset )
          // setEnteredHTML(enteredHTML.slice(0, positionStart) + enteredHTML.slice(posEnd))
          // // setEnteredHTML( deleteString(enteredHTML, positionStart, posEnd) )
          // console.log(caret, cursorPos.focusOffset, "positionStart", positionStart, posEnd ,  enteredHTML.slice(0, positionStart) + enteredHTML.slice(posEnd))
          // // Cursor.setCurrentCursorPosition(2, textAreaRef.current)
          // //positionStart-"<span class='color-primary'>@".length,
          //RichText.deleteNode(enteredHTML, cursorPos,  highlightAT,  endTagAT)
          event.preventDefault()
          setIsDropdownList(false)

        }
      } else {
        switch (key){
          case 'Delete':
            deleteNextChar( enteredHTML, realPos, setEnteredHTML )
            break
          case 'Backspace':
            deletePreviousChar( enteredHTML, realPos, setEnteredHTML )
            RichText.decrementPositionCursor( 1, cursorPos, setCaret )
            break
        }
      }
    }
  }

  const clickHandling = event => {
    const element = textAreaRef.current
    const cursor = Cursor.getCurrentCursorPosition(element)
    console.log("mouseEnterHandling", cursor, cursor.focusNode.textContent, enteredHTML)
    if (cursor.focusNode.parentNode.nodeName === 'SPAN' && cursor.focusOffset - 1 !== cursor.focusNode.textContent.length){
      console.log(cursor.focusNode.textContent.slice(1), users)
      filteredUsers.map((user, index) => {
        if (userFullName(user) === cursor.focusNode.textContent.slice(1)){
          setCurrent(user.id)
          setIndex(index)
          console.log(user, index, filteredUsers)
        }
      })
      setIsDropdownList(true)
      // Cursor.setCurrentCursorPosition(cursor.charCount-cursor.focusOffset+1, element)
      setCaret(cursor.charCount )//-cursor.focusOffset+1
    } else { setIsDropdownList(false) }
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