import React, {Fragment, useEffect, useRef, useState} from "react";
import {convertUsersToString} from "../../helpers/helpers";
import parse from "html-react-parser";
import {mentionToRichText} from "../CausesToCelebrate";
import {closePickerCallback} from "./QuestionSection";
import EmojiPickerComponent from "./EmojiPicker";
import isEmpty from "ramda/src/isEmpty";
import Tippy from "@tippyjs/react";
import ShowEmojis from "./ShowEmojis";

const ShoutoutItem = ({shoutout, prefix, users = [], emojis, current_user}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [emojisArr, setEmojisArr] = useState(emojis || []);
  const modalRef = useRef(null);
  const [emojiObject, setEmojiObject] = useState({});

  useEffect(() => {
    if (selectedEmoji) {
      setShowEmojiPicker(false)
      setEmojiObject(Object.assign({}, emojiObject, {
        emoji: selectedEmoji,
        emojiable_id: shoutout.id,
        emojiable_type: 'Shoutout'})
      )
    }
  }, [selectedEmoji])

  useEffect(() => {
    setEmojisArr(emojis)
  }, [emojis])

  closePickerCallback(modalRef, showEmojiPicker, setShowEmojiPicker)

  return <div className='row wrap shoutout answer mb-1 w-auto'>
    <div className="col-xl-12">
      <div className='h5 w-auto text-start truncated fw-semibold'>
        {prefix}
        {prefix && convertUsersToString(users)}
        {!prefix && parse(mentionToRichText(shoutout.rich_text))}
        {prefix && <Fragment>"{parse(mentionToRichText(shoutout.rich_text))}"</Fragment>}
      </div>
      <div className="d-flex align-self-center justify-content-end position-relative">
        <ShowEmojis {...{emojiObject, setSelectedEmoji, emojisArr, setEmojisArr, current_user, setEmojiObject}} />
        <div className='pointer d-flex align-items-center' onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ fontSize: 20 }}>
          {!isEmpty(emojisArr) && <span>|</span>}
          <Tippy content={<div className='emoji-tooltip'>Add reaction...</div>} >
            <div className='emoji-button' />
          </Tippy>
        </div>
        {showEmojiPicker && <EmojiPickerComponent ref={modalRef} {...{emojiObject, setSelectedEmoji, emojisArr, setEmojisArr, setEmojiObject, current_user}} />}
      </div>
    </div>
  </div>
}

export default ShoutoutItem
