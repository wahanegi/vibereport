import React, {Fragment, useEffect, useRef, useState} from 'react';
import parse from "html-react-parser";
import Cursor, {
  decodeSpace,
  decodeSpace160, decrementPositionCursor,
  deleteNextChar,
  deletePreviousChar,
  encodeSpace,
  incrementPositionCursor, pasteSymbolsToHTMLobj, sortUsersByFullName
} from "../helpers/library";
import DropDownList from "./DropDownList";
import {userFullName} from "../helpers/library";
import RichText from "../helpers/rich-text";
import xClose from "../../../assets/sys_svg/x-close.svg";
import Button from "./Button";



const RichInputElement =
({ richText = "", listUsers: listAllUsers, className, setChosenUsers, setRichText, onSubmit , classAt = 'color-primary'}) =>{

  const [enteredHTML, setEnteredHTML] = useState( encodeSpace(richText))
  const textAreaRef = useRef(richText)
  const [filteredUsers, setFilteredUsers] = useState(sortUsersByFullName(listAllUsers))
  const [ isDropdownList, setIsDropdownList ] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [indexOfSelection, setIndexOfSelection] = useState (0)
  const [currentSelection, setCurrentSelection] = useState(
      filteredUsers.length ? filteredUsers[0].id : "")
  const [caret, setCaret] = useState(textAreaRef.current.length)
  const [copyChosenUsers, setCopyChosenUsers] = useState([])
  const [ coordinates, setCoordinates] = useState({ x:420, y:386 })
  const [ cursorPosition, setCursorPosition ] = useState(null)

  const element = textAreaRef.current
  const NON_ALLOWED_CHARS =  /[,@`<>;:\/\\']/
  const MARKER = '@'
  const TAG_AT = '<span class=\"' + classAt + '\">' + MARKER
  const END_TAG_AT = '</span>'
  const OFFSET_X = 0
  const OFFSET_Y = 40
  const LIMIT_CHARS = 387

  useEffect(() => {
      Cursor.setCurrentCursorPosition(caret, textArea)
    if (Cursor.getCurrentCursorPosition(element).focusOffset == 1)
      setCoordinates(Cursor.getCurrentCursorPosition(element).coordinates)
    setCursorPosition(Cursor.getCurrentCursorPosition(element))

  }, [caret, enteredHTML, currentSelection])



  useEffect(()=>{
    if(richText.includes(TAG_AT)){
      let users = RichText.findUsersInText( TAG_AT,END_TAG_AT, richText, listAllUsers)
      setChosenUsers(users)
      setCopyChosenUsers(users)
      setFilteredUsers( RichText.filtrationById( users, listAllUsers ))}
  },[])

  const handleKeyDown = event => {
    event.preventDefault()
    const text = element.textContent
    const cursorPos = Cursor.getCurrentCursorPosition(element)
    const caretCur = cursorPos.charCount
    const realPos = cursorPos.realPos
    let key = event.key
    let htmlText = ''
    if (cursorPos.isDIV) {
      setIsDropdownList(false)
    }
    if (cursorPos.isSPAN) {
      setIsDropdownList(true)
    }
    console.log("75: start", key, text.length, caretCur, isDropdownList, enteredHTML, cursorPos) //.parentNode.textContent


    if (key.match(/[&<>]/)) return

    if (text.length < LIMIT_CHARS) {


    if (isDropdownList) {

      if (key === 'Escape' || key === MARKER) {
        if (text[caret - 1] === MARKER) {
          RichText.deleteNodePasteChars(
              enteredHTML, cursorPos, key === MARKER
                  ? MARKER + MARKER
                  : MARKER, TAG_AT, END_TAG_AT, setEnteredHTML, setCaret
          )
        }
        setIsDropdownList(false)
        return
      }

      if (key === 'Enter' || key === 'Tab') {
        clickEnterTabHandling(indexOfSelection)
        return
      }

      let indexOfSel = indexOfSelection
      if (!(String.fromCharCode(event.keyCode)).match(NON_ALLOWED_CHARS) && key.length === 1) {

        if (cursorPos.focusOffset - 1 !== searchString.length) return

        const newSearchString = (searchString + key).toLowerCase()
        const listFoundUsers = listAllUsers.filter(user => userFullName(user).toLowerCase().startsWith(newSearchString))

        if (listFoundUsers.length === 1 && userFullName(listFoundUsers[0]).toLowerCase() === newSearchString) {
          //when full name of user to equal to search string
          // and one element in the array than start update copyChosenUsers and chosenUsers

          if (copyChosenUsers.find(user => userFullName(user) === newSearchString))
            return //if user have in the chosenUsers

          setEnteredHTML(
              RichText.pasteContentBtwTags(userFullName(listFoundUsers[0]), enteredHTML, cursorPos, END_TAG_AT, 1)
          )
          setCopyChosenUsers([...copyChosenUsers, listFoundUsers[0]])
          setChosenUsers([...copyChosenUsers, listFoundUsers[0]])
          setIsDropdownList(false)
          RichText.incrementPositionCursor(1, cursorPos, text + " ", setCaret)
          setSearchString('')
        } else if (listFoundUsers.length) {
          //delete user from text, Users, ChosenUsers and put in it char

          htmlText = decodeSpace(enteredHTML)
          const userToDel = RichText.contentBtwTags(enteredHTML, cursorPos, END_TAG_AT, 1)
          setCopyChosenUsers(copyChosenUsers.filter(user => userFullName(user) !== userToDel)) // delete user from Users
          setChosenUsers(copyChosenUsers.filter(user => userFullName(user) !== userToDel)) // delete user from ChosenUsers

          RichText.pasteCharsBeforeEndTag(key, enteredHTML, cursorPos, END_TAG_AT, setEnteredHTML, setCaret)

          setSearchString(newSearchString)
          setFilteredUsers(listFoundUsers)
          setIndexOfSelection(0)
          // setCaret(caretCur + 1)
        }
        setChosenUsers(listAllUsers.filter(item => !copyChosenUsers.includes(item)))
      }

      if ((key === 'ArrowDown') && indexOfSelection >= 0) {
        setIndexOfSelection(indexOfSel = indexOfSelection < filteredUsers.length - 1 ? ++indexOfSel : 0)
        setCurrentSelection(filteredUsers[indexOfSel].id)
        return
      }

      if (key === 'ArrowUp' && indexOfSelection >= 0) {
        setIndexOfSelection(indexOfSel = indexOfSelection > 0 ? --indexOfSel : filteredUsers.length - 1)
        setCurrentSelection(filteredUsers[indexOfSel].id)
        return
      }

    } else {
      if (cursorPos.isDIV && key.length === 1) {
        switch (key) {
          case MARKER:
            if (text.length === 0 || caretCur === text.length && text[caretCur - 1] === "\u00A0"
                || caretCur > 0 && caretCur < text.length && text.charCodeAt(caretCur - 1) === 160
                && text.charCodeAt(caretCur) === 160
                || caretCur === 0 && text.length > 0 && text.charCodeAt(caretCur) === 160) {
              RichText.pasteNodeToHTMLobj(
                  MARKER, enteredHTML, cursorPos, setEnteredHTML, setCaret, TAG_AT.slice(0, -1), END_TAG_AT
              )
              setIsDropdownList(true)
              if (cursorPos.coordinates.y !== 0 && cursorPos.coordinates.x !== 0) {
                setCoordinates(cursorPos.coordinates)
              }
              return;
            } else {

            }
          default:
            RichText.pasteSymbolsToHTMLobj(key, enteredHTML, cursorPos, setEnteredHTML, setCaret)
        }
      } else if (cursorPos.isSPAN && key.length === 1) {
        const nameUserToDel = RichText.contentBtwTags(enteredHTML, cursorPos, END_TAG_AT, 1)
        if (listAllUsers.find(user => userFullName(user) === nameUserToDel) && !key.match(/[@<>]/)
            && nameUserToDel.length === cursorPos.focusOffset - 1) {
          //if user have in the ListUsers  and cursor at the end of firstLastName of user
          //then dropdown turn off and put chars in the DIV after endTag

          const pos = realPos + END_TAG_AT.length
          const end = pos === enteredHTML.length ? '' : enteredHTML.slice(pos)
          setEnteredHTML(encodeSpace(enteredHTML.slice(0, pos) + key + end))
          setCaret(caret + 1)
          setIsDropdownList(false)

        } else if (!key.match(/[,@`<>;:\\\/\s]/)) {
          const renewUsers = copyChosenUsers.filter(user => userFullName(user) !== nameUserToDel)
          setCopyChosenUsers(!renewUsers ? [] : renewUsers)
          setChosenUsers(!renewUsers ? [] : [...renewUsers])
          RichText.pasteCharsBeforeEndTag(key, enteredHTML, cursorPos, END_TAG_AT, setEnteredHTML, setCaret)
          setIsDropdownList(true)
          setCaret(caretCur - cursorPos.focusOffset + 2)
          setSearchString(key)
        }
      }

      if (key.length === 1 && enteredHTML.length > realPos
          && enteredHTML.indexOf(TAG_AT) === realPos && !key.match(/<>&/)) {
        pasteSymbolsToHTMLobj(key, enteredHTML, cursorPos, setEnteredHTML, setCaret)
      }
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
          if( cursorPos.isSPAN && cursorPos.focusOffset === 1 ) {
            setIsDropdownList(false)
            setCoordinates(cursorPos.coordinates)
          }
        decrementPositionCursor( 1, cursorPos, setCaret )
        break

      case 'ArrowRight':
        if( cursorPos.isSPAN && cursorPos.focusOffset === 1 ) {
          setIsDropdownList(true)
          setCoordinates(cursorPos.coordinates)
        }
        incrementPositionCursor( 1, cursorPos, text, setCaret )
        break
    }

    if (key === 'Backspace' || key === 'Delete') {
      if (  cursorPos.isSPAN && cursorPos.focusNode.textContent === MARKER) {
        const endPos = enteredHTML.indexOf(END_TAG_AT, cursorPos.realPos) + END_TAG_AT.length
        setEnteredHTML(RichText.deleteString(enteredHTML, cursorPos.realPos - TAG_AT.length, endPos))
        setCaret(caret - 1)
        setIsDropdownList(false)
        return
      }
      if ( cursorPos.focusNode.textContent.startsWith(MARKER) && cursorPos.isSPAN ) {
        let findUser = copyChosenUsers.find((el) => (
            MARKER + userFullName( el )) === decodeSpace160( cursorPos.focusNode.textContent ))

        if (findUser) {
          const newListUser = copyChosenUsers.filter(user => user.id !== findUser.id)
          setChosenUsers(newListUser)
          setCopyChosenUsers(newListUser)
          const sortUsers = sortUsersByFullName([...filteredUsers, findUser])
          setFilteredUsers( sortUsers )
          setIndexOfSelection(0)
          setCurrentSelection(sortUsers[0].id)

          RichText.deleteNode( enteredHTML, cursorPos, TAG_AT, END_TAG_AT, setEnteredHTML, setCaret )

          event.preventDefault()
          setIsDropdownList(false)

        } else {
          if (key === 'Backspace') {
            const updateSearchString =  searchString.slice(0,-1)

            RichText.deletePreviousChar( enteredHTML, realPos, setEnteredHTML )
            RichText.decrementPositionCursor( 1, cursorPos, setCaret )

            const foundUsersByFirstLetters =
                RichText.searchUsersByFirstLetters(updateSearchString,RichText.filtrationById(copyChosenUsers,listAllUsers))

            setSearchString( updateSearchString )
            setFilteredUsers( foundUsersByFirstLetters )
          }
        }
      } else {
        switch (key){
          case 'Delete':
            if( enteredHTML.indexOf(TAG_AT, realPos) === realPos ) {
              const node = RichText.deleteNode( enteredHTML, cursorPos, TAG_AT, END_TAG_AT, setEnteredHTML, setCaret )
              const userFromNode = cursorPos.isSPAN ? node
                  : RichText.findUsersInText(TAG_AT, END_TAG_AT, decodeSpace( node ), listAllUsers)
              const filtratedUsersByName = RichText.filtrationByName (userFullName( userFromNode[0] ), copyChosenUsers)
              setCopyChosenUsers( filtratedUsersByName )
              setChosenUsers( filtratedUsersByName )
            } else {
              deleteNextChar( enteredHTML, realPos, setEnteredHTML )
            }
            break
          case 'Backspace':
            deletePreviousChar( enteredHTML, realPos, setEnteredHTML )
            RichText.decrementPositionCursor( 1, cursorPos, setCaret )
            break
        }
      }
    }
  }
const clickEnterTabHandling = ( i ) => {
  if ( i === undefined ) {
    setIsDropdownList(false)
    return
  }
    const cursorPos = cursorPosition
    const realPos  = cursorPos.realPos
     let chosenUsersWithoutNemo = copyChosenUsers

  const nemoFromTextArea = RichText.contentBtwTags( enteredHTML, cursorPos, END_TAG_AT, 1)
  if ( copyChosenUsers.find(user => userFullName(user) === nemoFromTextArea ) ){
    chosenUsersWithoutNemo = copyChosenUsers.filter(user => userFullName(user) !== nemoFromTextArea)
  }
  if ( copyChosenUsers.find(user => userFullName(user) === userFullName(filteredUsers[i])) ) {
    alert ("This user has already been selected!")
    return }

  setEnteredHTML(
      RichText.pasteContentBtwTags( userFullName(filteredUsers[i]), enteredHTML, cursorPos, END_TAG_AT, 1)
  )
  const hadSelectedUsers = [ ...chosenUsersWithoutNemo, { ...filteredUsers[i] }]

  setCopyChosenUsers( hadSelectedUsers )
  setChosenUsers( hadSelectedUsers )
  setIsDropdownList(false)
  RichText.incrementPositionCursor(  userFullName(filteredUsers[i]).length -cursorPos.focusOffset  + 1 ,
      cursorPos, enteredHTML , setCaret )
  const listChosenUsers = RichText.filtrationById( hadSelectedUsers, listAllUsers )
  setIndexOfSelection(0)
  setSearchString('')
  setIndexOfSelection(0)
  setCursorPosition(cursorPos)
  setFilteredUsers( listChosenUsers)
  if (!listChosenUsers.length) {return}
  setCurrentSelection(listChosenUsers[0].id)
}
  const clickHandling = event => {
    const element = textAreaRef.current
    const cursor = Cursor.getCurrentCursorPosition(element)

    if (cursor.isSPAN && cursor.focusOffset - 1 !== cursor.focusNode.textContent.length){
      filteredUsers.map((user, index) => {
        if (userFullName(user) === cursor.focusNode.textContent.slice(1)){
          setCurrentSelection(user.id)
          setIndexOfSelection(index)
        }
      })
      setIsDropdownList(true)
      setCoordinates(Cursor.getCurrentCursorPosition(element).coordinates)
      setCaret(cursor.charCount )
    } else { setIsDropdownList(false) }
  }

  return (
    <div className='col-8 offset-2 positon-absolute'>
      <div className='shoutout-input-block mt327'>
      <img src={xClose} className='position-absolute x-close' onClick={()=>{alert("onClose")}}/>
      <div className=' d-flex flex-column align-items-center'>
        <div contentEditable={true}
             suppressContentEditableWarning = {true}
               onKeyDown = {handleKeyDown}
                 onClick = {clickHandling}
                     ref = {textAreaRef}
             data-testid ="editable-div"
                      id = 'textArea'
               className = 'c3 place-size-shout-out form-control text-start d-inline-block lh-sm pt-3'>
          {parse(enteredHTML)}
        </div>
        <Button className='placement-shoutout-btn position-relative btn-modal system c2 p-0' onClick={()=>{}}>
          Send Shoutout
        </Button>
      </div>
      {isDropdownList && filteredUsers.length && indexOfSelection !== undefined &&
          <DropDownList dataList={filteredUsers}
                        coordX={coordinates.x + OFFSET_X}
                        coordY={coordinates.y + OFFSET_Y}
                        onClick={clickEnterTabHandling}
                        valSel={currentSelection}
                        changeIndexSel={ (val) =>{ setIndexOfSelection(val) }}
                        changeValSel={ (val) =>{ setCurrentSelection(val) }}
          />}
      </div>
    </div>
  )}

export default RichInputElement;

