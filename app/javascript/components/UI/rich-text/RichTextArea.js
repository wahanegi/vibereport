import React, {useEffect, useState} from 'react';
import parse from "html-react-parser";

const RichTextArea = ({textHTML, refs ,  onKeyDown , onClick , className, cursorPos, placeholder }) => {
    const [isNotActive, setIsNotActive] = useState(true)
  useEffect(() => {
    const rect = refs.current.getBoundingClientRect();
    const isCaretWithinBounds = rect.top < cursorPos.coordinates.y && rect.bottom > cursorPos.coordinates.y
    if( process.env.NODE_ENV !== 'test' && !isCaretWithinBounds ) {
      refs.current.scrollBy({ top: cursorPos.coordinates.y - rect.y })
    }

  }, [cursorPos]);

    const handleOnKeyUp= (e) =>{
        !textHTML.length ? setIsNotActive(true) : setIsNotActive(false)
    }
    const handleOnClick = () =>{
        onClick()
        setIsNotActive(false)
    }

    const onContextMenuHandling = (e) => {
      setIsNotActive(false)
    }
    return (
        <div className = {` ${className} overflow-hidden`}>
          <div contentEditable={ true }
             suppressContentEditableWarning = { true }
             onKeyDown = { onKeyDown }
               onKeyUp = { handleOnKeyUp }
               onClick = { handleOnClick }
         onContextMenu = { onContextMenuHandling }
                   ref = { refs }
           data-testid = "editable-div"
                    id = 'textArea'
             className = {`c3 form-control text-start  inner-div scrolling  ${isNotActive && 'gray-300'}`}>
            { parse( !textHTML.length && isNotActive ?   placeholder : textHTML ) }
          </div>
        </div>
    );
};

export default RichTextArea;