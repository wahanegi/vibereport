import parse from "html-react-parser";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {convertUsersToString} from "../../helpers/helpers";
import EmojiRow from "./Emojis/EmojiRow";

const ShoutoutItem = ({shoutout, prefix, users = [], emojis, current_user}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedEmojiName, setSelectedEmojiName] = useState("");
  const [emojisArr, setEmojisArr] = useState(emojis || []);
  const modalRef = useRef(null);
  const [emojiObject, setEmojiObject] = useState({});

  useEffect(() => {
    if (selectedEmoji) {
      setShowEmojiPicker(false)
      setEmojiObject(Object.assign({}, emojiObject, {
          emoji_code: selectedEmoji,
          emoji_name: selectedEmojiName,
          emojiable_id: shoutout.id,
          emojiable_type: 'Shoutout'
        })
      )
    }
  }, [selectedEmoji])

  useEffect(() => {
    setEmojisArr(emojis)
  }, [emojis])

  return <div className='row wrap shoutout answer mb-1 w-auto'>
    <div className="col-xl-12">
      <div className='fs-7 fs-xxl-6 fs-xl-6 fs-lg-6 fs-md-6 fs-sm-7 w-auto text-start truncated fw-semibold'>
        {prefix}
        {prefix && convertUsersToString(users)}
        {!prefix && parse(shoutout.rich_text)}
        {prefix && <Fragment>"{parse(shoutout.rich_text)}"</Fragment>}
      </div>
      <EmojiRow {...{
        emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr, setEmojisArr, current_user,
        setEmojiObject, showEmojiPicker, setShowEmojiPicker, modalRef
      }} />
    </div>
  </div>
}

export default ShoutoutItem
