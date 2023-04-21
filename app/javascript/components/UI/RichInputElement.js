import React, {useRef, useState} from 'react';
import parse from "html-react-parser";
import Cursor from "../helpers/library";

const RichInputElement = ({ richText = "", listUsers, className, setChosenUsers, setRichText, onSubmit}) =>{
  const [enteredValue, setEnteredValue] = useState(richText)
  const textAreaRef = useRef('')

  const handleKeyDown = event => {

  }

  const clickHandling = event => {

  }

  const keyUpHandling = event => {

  }

  const changeHandling = event => {

  }

  return (
    <div contentEditable={true}
         suppressContentEditableWarning = {true}
         onKeyDown={handleKeyDown}
         onKeyUp=  {keyUpHandling}
         onInput=  {changeHandling}
         onClick=  {clickHandling}
         ref=      {textAreaRef}
         data-testid="editable-div"
         className='c3 place-size-shout-out form-control text-start d-inline-block'>
      {parse(enteredValue)}
    </div>
  )}

export default RichInputElement;