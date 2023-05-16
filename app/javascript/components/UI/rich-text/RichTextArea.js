import React, {useEffect} from 'react';
import parse from "html-react-parser";
import Cursor from "./cursor";

const RichTextArea = ({textHTML, refs ,  onKeyDown , onClick , className, cursorPos }) => {
  useEffect(() => {
    const rect = refs.current.getBoundingClientRect();
    const isCaretWithinBounds = rect.top < cursorPos.coordinates.y && rect.bottom > cursorPos.coordinates.y
    if( process.env.NODE_ENV !== 'test' && !isCaretWithinBounds ) {
      refs.current.scrollBy({ top: cursorPos.coordinates.y - rect.y })
    }

  }, [cursorPos]);
    const onContextMenuHandling = (e) => {
        e.preventDefault()
    }
    return (
        <div className = {` ${className} overflow-hidden`}>
          <div contentEditable={ true }
             suppressContentEditableWarning = { true }
             onKeyDown = { onKeyDown }
               onClick = { onClick }
         onContextMenu = { onContextMenuHandling }
                   ref = { refs }
           data-testid = "editable-div"
                    id = 'textArea'
             className = 'c3 form-control text-start  inner-div scrolling'>
            { parse( textHTML ) }
          </div>
        </div>
    );
};

export default RichTextArea;