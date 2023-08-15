import ShowEmojis from "./ShowEmojis";
import isEmpty from "ramda/src/isEmpty";
import Tippy from "@tippyjs/react";
import {isPresent} from "../../../helpers/helpers";
import EmojiPickerComponent from "./EmojiPicker";
import React, {useEffect, useRef, useState} from "react";

 const calculatePickerPosition = (inputRef, showEmojiPicker, setPickerPosition) => {
  useEffect(() => {
    if (inputRef.current && showEmojiPicker) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const spaceAbove = inputRect.top;
      const spaceBelow = screenHeight - inputRect.bottom;

      if (spaceBelow >= 450 || spaceBelow >= spaceAbove) {
        setPickerPosition({
          top: '20px'
        });
      } else {
        setPickerPosition({
          bottom: '20px'
        });
      }
    }
  }, [showEmojiPicker])
};

const closePickerCallback = (modalRef, showEmojiPicker, setShowEmojiPicker, setPickerPosition) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setPickerPosition({})
      }
    }
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);
};

const EmojiRow = ({emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr, setEmojisArr, current_user,
                   setEmojiObject, showEmojiPicker, setShowEmojiPicker, modalRef}) => {

  const inputRef = useRef(null);
  const [pickerPosition, setPickerPosition] = useState({});

  closePickerCallback(modalRef, showEmojiPicker, setShowEmojiPicker, setPickerPosition)
  calculatePickerPosition(inputRef, showEmojiPicker, setPickerPosition)

  return <div className="emoji-container d-flex justify-content-end position-relative">
    <ShowEmojis {...{emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr, setEmojisArr, current_user, setEmojiObject}} />
    <div ref={inputRef} className='pointer d-flex align-items-center' onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ fontSize: 20 }}>
      {!isEmpty(emojisArr) && <span>|</span>}
      <Tippy content={<div className='emoji-tooltip'>Add reaction...</div>} >
        <div className='emoji-button' />
      </Tippy>
    </div>
    {
      showEmojiPicker && isPresent(pickerPosition) &&
      <EmojiPickerComponent
        ref={modalRef}
        {...{emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr,
          setEmojisArr, setEmojiObject, current_user, pickerPosition}} />
    }
  </div>
}

export default EmojiRow
