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



const RichInputElement =
({ richText = "", listUsers: listAllUsers, className, setChosenUsers, setRichText, onSubmit , classAt = 'color-primary'}) =>{

  const [enteredHTML, setEnteredHTML] = useState( encodeSpace(richText))
  const textAreaRef = useRef(richText)
  const [filteredUsers, setFilteredUsers] = useState(sortUsersByFullName(listAllUsers))
  const [ isDropdownList, setIsDropdownList ] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [indexOfSelection, setIndexOfSelection] = useState (0)
  const [currentSelection, setCurrentSelection] = useState(filteredUsers[indexOfSelection].id)
  const [caret, setCaret] = useState(textAreaRef.current.length)
  const [copyChosenUsers, setCopyChosenUsers] = useState([])
  const [ ctrl, setCtrl] = useState(false)
  const [ coordinates, setCoordinates] = useState({ x:420, y:386 })
  const [ cursorPosition, setCursorPosition ] = useState(null)

  const [isNotCompleteInputUser, setIsNotCompleteInputUser] = useState(true)
  const element = textAreaRef.current
  const NON_ALLOWED_CHARS =  /[,@`<>;:\/\\']/
  const TAG_AT = '<span class=\"' + classAt + '\">@'
  const END_TAG_AT = '</span>'
  const OFFSET_X = 0
  const OFFSET_Y = 40

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
    const realPos  = cursorPos.realPos
    let key = event.key
    let htmlText = ''
    if( cursorPos.isDIV ) { setIsDropdownList(false) }
    if( cursorPos.isSPAN ) { setIsDropdownList(true) }

    console.log("75: start", key, text.length, caretCur,  isDropdownList, enteredHTML, cursorPos) //.parentNode.textContent

    if (key.match(/[&<>]/)) return


    if (isDropdownList) {

      if( key === 'Escape' || key === '@') {
        if(text[caret-1] === "@") {
          RichText.deleteNodePasteChars(
              enteredHTML, cursorPos, key === '@' ? '@@' : '@' , TAG_AT, END_TAG_AT, setEnteredHTML, setCaret
          )
        }
        setIsDropdownList(false)
        return
      }

      if ( key === 'Enter' || key === 'Tab') {
        clickEnterTabHandling( indexOfSelection )
        return
      }

      let i = indexOfSelection
      setIsNotCompleteInputUser(true)
      if (!(String.fromCharCode(event.keyCode)).match(NON_ALLOWED_CHARS) && key.length === 1 ) {

        if ( cursorPos.focusOffset - 1  !== searchString.length )  return

        const newSearchString = ( searchString + key ).toLowerCase()
        const listFoundUsers = listAllUsers.filter(user => userFullName(user).toLowerCase().startsWith(newSearchString))
        console.log('search = ', newSearchString, listFoundUsers)

        if ( listFoundUsers.length === 1  && userFullName(listFoundUsers[0]).toLowerCase() === newSearchString ) {
          //when full name of user to equal to search string
          // and one element in the array than start update copyChosenUsers and chosenUsers

          if ( copyChosenUsers.find(user => userFullName(user) === newSearchString ))
            return //if user have in chosenUsersUsers

          setEnteredHTML(
              RichText.pasteContentBtwTags( userFullName(listFoundUsers[0]), enteredHTML, cursorPos, END_TAG_AT, 1 )
          )
          setCopyChosenUsers([...copyChosenUsers, listFoundUsers[0]])
          setChosenUsers([...copyChosenUsers, listFoundUsers[0]])
          setIsDropdownList(false)
          RichText.incrementPositionCursor(1, cursorPos, text + " ", setCaret )
          // setCaret(caretCur + 1)
          setSearchString('')
          setIsNotCompleteInputUser(false)
        } else if( listFoundUsers.length ) {
          //delete user from text, Users, ChosenUsers and put in it char
          // console.log("125 listFoundUsers=", "key=", encodeSpace(key), listFoundUsers, "enteredHTML=",enteredHTML, "realPos=", realPos, "cursorPos=", cursorPos, "copyChosenUsers=", copyChosenUsers)
          htmlText = decodeSpace(enteredHTML)
          // console.log("128 enteredHtml=", enteredHTML, "htmlText=", htmlText, "key=", encodeSpace(key),)
          // const userToDel = decodeSpace(
          //   enteredHTML.slice(realPos - cursorPos.focusOffset + 1, enteredHTML.indexOf(END_TAG_AT ,realPos))
          // )
          const userToDel = RichText.contentBtwTags( enteredHTML, cursorPos, END_TAG_AT, 1)
          // console.log(realPos, cursorPos.focusOffset + 1, enteredHTML.indexOf(END_TAG_AT ,realPos))
          // console.log(userToDel, "key=", encodeSpace(key), copyChosenUsers.filter(user => firstLastName(user) !== userToDel)) //take user from text
          setCopyChosenUsers(copyChosenUsers.filter(user => userFullName(user) !== userToDel)) // delete user from Users
          setChosenUsers(copyChosenUsers.filter(user => userFullName(user) !== userToDel)) // delete user from ChosenUsers
          // setEnteredHTML(encodeSpace(enteredHTML.slice(0, realPos) + encodeSpace( key ) +
          //   enteredHTML.slice(enteredHTML.indexOf(END_TAG_AT, realPos)))) // input char from key
          RichText.pasteCharsBeforeEndTag( key, enteredHTML, cursorPos, END_TAG_AT, setEnteredHTML, setCaret )

          // console.log("145key=", encodeSpace(key), "charPos/realPos", cursorPos.charCount, realPos,"enteredHtml=", enteredHTML,
          //   "htmlText=", htmlText, "userToDel=", userToDel, 'result=',
          //   encodeSpace(enteredHTML.slice(0, realPos) + encodeSpace( key ) +
          //     enteredHTML.slice(enteredHTML.indexOf(END_TAG_AT, realPos))),
          //   'search = ', newSearchString, listFoundUsers
          // )
          setSearchString(newSearchString)
          setFilteredUsers( listFoundUsers )
          setIndexOfSelection(0)
          // setCaret(caretCur + 1)
        }
        // setSearchString(newSearchString)
        setChosenUsers(listAllUsers.filter(item => !copyChosenUsers.includes(item)))
      }

      if ( (key === 'ArrowDown' ) && indexOfSelection >= 0 ) {
        setIndexOfSelection(i = indexOfSelection < filteredUsers.length - 1 ? ++i : 0)
        setCurrentSelection(filteredUsers[i].id)
        return
      }

      if ( key === 'ArrowUp' && indexOfSelection >= 0 ) {
        // console.log("press Enter or Tab when is Dropdown list turn on", "i=",i, "f=", filteredUsers[i])
        setIndexOfSelection(i = indexOfSelection > 0 ? --i : filteredUsers.length - 1)
        setCurrentSelection(filteredUsers[i].id)
        return
      }

    } else {
      htmlText = encodeSpace(enteredHTML)
      // console.log(htmlText)
      // console.log(cursorPos)//.focusNode.parentNode.tagName
      if ( cursorPos.isDIV && event.key.length === 1 ) {
        // event.preventDefault()
        switch (event.key) {
          case '@':
            // console.log(htmlText, realPos)
            if ( text.length === 0 || caretCur === text.length && text[caretCur - 1] ===  "\u00A0"
              || caretCur > 0 && caretCur < text.length && text.charCodeAt(caretCur-1) === 160
                && text.charCodeAt(caretCur) === 160
              || caretCur === 0 && text.length > 0 && text.charCodeAt(caretCur) === 160) {
              // console.log("218: ",)
              // setEnteredHTML(encodeSpace(decodeSpace( htmlText ).slice(0, realPos) +
              //   highlightAT + END_TAG_AT + decodeSpace( htmlText ).slice(realPos))
              RichText.pasteNodeToHTMLobj(
                  "@", enteredHTML, cursorPos, setEnteredHTML, setCaret, TAG_AT.slice(0,-1), END_TAG_AT
              )
              setIsDropdownList(true)
              if( cursorPos.coordinates.y !==0 && cursorPos.coordinates.x !==0) {
                setCoordinates(cursorPos.coordinates)
              }
              // setCaret(caretCur + 1)
              // console.log("switch @", caret)
              return;
            } else {

            }
          default:
            RichText.pasteSymbolsToHTMLobj( key, enteredHTML, cursorPos, setEnteredHTML, setCaret )
            // setEnteredHTML(encodeSpace(enteredHTML.slice(0, realPos) + key + enteredHTML.slice(realPos)))
            // RichText.incrementPositionCursor( 1, cursorPos, htmlText , setCaret)
        }
      } else if ( cursorPos.isSPAN && event.key.length === 1 ) {
        // event.preventDefault()
        const startNameUser = realPos - cursorPos.realFocusOffset + 1
        const endNameUser = encodeSpace( enteredHTML ).indexOf(END_TAG_AT, realPos)
        // const nameUserToDel1 = decodeSpace(encodeSpace( enteredHTML ).slice(startNameUser, endNameUser))
        const nameUserToDel = RichText.contentBtwTags( enteredHTML, cursorPos, END_TAG_AT, 1)
        // console.log("STRANGE=", nameUserToDel, nameUserToDel1)
        // console.log(startNameUser, endNameUser, nameUserToDel, cursorPos.focusOffset , realPos, encodeSpace( enteredHTML ))
//undefined !==
        if (listAllUsers.find(user => userFullName(user) === nameUserToDel)
          && !event.key.match(/[@<>]/) && nameUserToDel.length === cursorPos.focusOffset - 1) {
          //if user have in the ListUsers and key have not chars @,<,> and cursor at the end of firstLastName of user
          //then dropdown turn off
          const pos = realPos + END_TAG_AT.length
          const end = pos === htmlText.length ? '' : htmlText.slice(pos)
          setEnteredHTML(encodeSpace(htmlText.slice(0,pos ) + event.key + end))
          setCaret(caret + 1)
          setIsDropdownList(false)

        } else if (!event.key.match(/[,@`<>;:\\\/\s]/)){
          event.preventDefault()
          const renewUsers = copyChosenUsers.filter(user => userFullName(user) !== nameUserToDel)
          //  === undefined
          setCopyChosenUsers( !renewUsers ? [] : renewUsers)
          setChosenUsers( !renewUsers ? [] : [...renewUsers])
          RichText.pasteCharsBeforeEndTag( key, enteredHTML, cursorPos, END_TAG_AT,setEnteredHTML, setCaret )
          // setEnteredHTML(encodeSpace(htmlText.slice(0, startNameUser) + event.key + htmlText.slice(endNameUser)))
          // console.log(startNameUser, endNameUser, nameUserToDel,
          //   "|",encodeSpace(htmlText).slice(0, startNameUser),"|",
          //   "|",htmlText.slice(endNameUser),"|",
          //   encodeSpace(htmlText.slice(0, startNameUser) + event.key + htmlText.slice(endNameUser)))
          setIsDropdownList(true)
          setCaret(caretCur - cursorPos.focusOffset + 2)
          setSearchString(event.key)
        }
      }

      if ( event.key.length === 1 && htmlText.length > realPos
        && htmlText.indexOf(TAG_AT) === realPos && !event.key.match(/<>&/)) {
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
        console.log("283: ARROW", cursorPos)
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
       console.log(enteredHTML[cursorPos.realPos], " Backspace selection =", cursorPos, enteredHTML,  enteredHTML.indexOf(TAG_AT, cursorPos.realPos), "@=", enteredHTML[cursorPos.realPos - 1])
      const offset = enteredHTML.indexOf(TAG_AT, cursorPos.realPos)

      if (  cursorPos.isSPAN && cursorPos.focusNode.textContent === '@') {
        console.log("299: true")
        const endPos = enteredHTML.indexOf(END_TAG_AT, cursorPos.realPos) + END_TAG_AT.length
        setEnteredHTML(RichText.deleteString(enteredHTML, cursorPos.realPos - TAG_AT.length, endPos))
        setCaret(caret-1)
        setIsDropdownList(false)
        return
      }
      if ( cursorPos.focusNode.textContent.startsWith('@') && cursorPos.isSPAN ) {
        console.log("textContent=", cursorPos.focusNode.textContent,"copyChosenUsers=", copyChosenUsers)
        let findUser = copyChosenUsers.find((el) => ('@' + userFullName( el )) === decodeSpace160( cursorPos.focusNode.textContent ))
        if (!!findUser) {
          console.log("findUser:", findUser)
          const newListUser = copyChosenUsers.filter(user => user.id !== findUser.id)
          setChosenUsers(newListUser)
          setCopyChosenUsers(newListUser)

          RichText.deleteNode( enteredHTML, cursorPos, TAG_AT, END_TAG_AT, setEnteredHTML, setCaret )

          event.preventDefault()
          setIsDropdownList(false)

        } else {
          if (key === 'Backspace') {
            let updateSearchString =  searchString.slice(0,-1)

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
            console.log("TAG_AT realPos = ", enteredHTML.indexOf(TAG_AT, realPos))
            if( enteredHTML.indexOf(TAG_AT, realPos) === realPos ) {
              const node = RichText.deleteNode( enteredHTML, cursorPos, TAG_AT, END_TAG_AT, setEnteredHTML, setCaret )
              console.log(node)
              const userFromNode = cursorPos.isSPAN ? node
                  : RichText.findUsersInText(TAG_AT, END_TAG_AT, decodeSpace( node ), listAllUsers)
              const filtratedUsersByName = RichText.filtrationByName (userFullName( userFromNode[0] ), copyChosenUsers)
              console.log(node, userFromNode, copyChosenUsers, filtratedUsersByName)
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
    const cursorPos = cursorPosition
  // const i = filteredUsers.find(user => user.id === id )
const realPos  = cursorPos.realPos
  console.log("ENTER")
  // if(cursorPos.isSPAN && cursorPos.focusOffset === 0) {setIsDropdownList(false); return}
  console.log("ENTER", cursorPos)
  let chosenUsersWithoutNemo = copyChosenUsers
  let htmlText = decodeSpace(enteredHTML)

  const nemoFromTextArea = RichText.contentBtwTags( enteredHTML, cursorPos, END_TAG_AT, 1)
//undefined !==
  if ( copyChosenUsers.find(user => userFullName(user) === nemoFromTextArea ) ){
    chosenUsersWithoutNemo = copyChosenUsers.filter(user => userFullName(user) !== nemoFromTextArea)
    // chosenUsersWithoutNemo = chosenUsersWithoutNemo.length === 0 ? [] : chosenUsersWithoutNemo
    console.log("chosenUsersWithoutNemo=",chosenUsersWithoutNemo, "copyChosenUsers=", copyChosenUsers)
  }
  console.log("i=", i, "| chosenUsersWithoutNemo =",chosenUsersWithoutNemo, copyChosenUsers.find(user => userFullName(user) === userFullName(filteredUsers[i])))
//undefined !==
  if ( copyChosenUsers.find(user => userFullName(user) === userFullName(filteredUsers[i])) ) {
    alert ("This user has already been selected")
    return }

  console.log("CHECK = ", nemoFromTextArea, filteredUsers[i],i , "htmlText=", htmlText)

  setEnteredHTML(
      RichText.pasteContentBtwTags( userFullName(filteredUsers[i]), enteredHTML, cursorPos, END_TAG_AT, 1)
  )
  console.log("encodeSpace(searchString).length=", encodeSpace(searchString).length,
      enteredHTML.slice(0, realPos - encodeSpace(searchString).length),
      enteredHTML.slice(enteredHTML.indexOf(END_TAG_AT, realPos))
  )
  const hadSelectedUsers = [ ...chosenUsersWithoutNemo, { ...filteredUsers[i] }]

  console.log( "hadSelectedUsers=", hadSelectedUsers )
  setCopyChosenUsers( hadSelectedUsers )
  setChosenUsers( hadSelectedUsers )
  setIsDropdownList(false)
  setCaret(caret - cursorPos.focusOffset  + 1 + userFullName(filteredUsers[i]).length )
  let temp = RichText.filtrationById( hadSelectedUsers, listAllUsers )
  setFilteredUsers( RichText.filtrationById( hadSelectedUsers, listAllUsers ))
  setIndexOfSelection(0)
  setCurrentSelection(temp[0].id)
  setSearchString('')
  setIndexOfSelection(0)
  setIsNotCompleteInputUser(false)
setCursorPosition(cursorPos)
}
  const clickHandling = event => {
    const element = textAreaRef.current
    const cursor = Cursor.getCurrentCursorPosition(element)
    console.log("mouseEnterHandling", cursor, cursor.focusNode.textContent, enteredHTML)
    if (cursor.isSPAN && cursor.focusOffset - 1 !== cursor.focusNode.textContent.length){
      console.log(cursor.focusNode.textContent.slice(1), copyChosenUsers)
      filteredUsers.map((user, index) => {
        if (userFullName(user) === cursor.focusNode.textContent.slice(1)){
          setCurrentSelection(user.id)
          setIndexOfSelection(index)
          console.log(user, index, filteredUsers)
        }
      })
      setIsDropdownList(true)
      setCoordinates(Cursor.getCurrentCursorPosition(element).coordinates)
      // Cursor.setCurrentCursorPosition(cursor.charCount-cursor.focusOffset+1, element)
      setCaret(cursor.charCount )//-cursor.focusOffset+1
    } else { setIsDropdownList(false) }
  }

  const keyUpHandling = event => {
// if(event.key === 'Home') {
//   Cursor.setCurrentCursorPosition( 0 , textAreaRef.currentSelection )
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
      {isDropdownList && !!filteredUsers.length &&
          <DropDownList dataList={filteredUsers}
                        coordX={coordinates.x + OFFSET_X}
                        coordY={coordinates.y + OFFSET_Y}
                        onClick={clickEnterTabHandling}
                        valSel={currentSelection}
                        changeIndexSel={ (val) =>{ setIndexOfSelection(val) }}
                        changeValSel={ (val) =>{ setCurrentSelection(val) }}
          />}

    </Fragment>
  )}

export default RichInputElement;