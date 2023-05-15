import React, {useEffect} from 'react';
import parse from "html-react-parser";

const RichTextArea = ({textHTML, refs ,  onKeyDown , onClick , className }) => {
    useEffect(()=>{
        const div = document.getElementById("textArea");
        div.addEventListener("contextmenu", (e) => {e.preventDefault()});
    },[])
    return (
        <div className = {` ${className} overflow-hidden`}>
          <div contentEditable={ true }
             suppressContentEditableWarning = { true }
             onKeyDown = { onKeyDown }
             onClick = { onClick }
             ref = { refs }
             data-testid ="editable-div"
             id = 'textArea'
             className = 'c3 form-control text-start  inner-div '>
            { parse( textHTML ) }
          </div>
        </div>
    );
};

export default RichTextArea;