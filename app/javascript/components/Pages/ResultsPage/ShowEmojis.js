import React, {Fragment, useEffect, useState} from "react";
import {isEmptyStr, usersEmoji} from "../../helpers/helpers";
import Tippy from "@tippyjs/react";
import {Emoji, EmojiStyle} from "emoji-picker-react";
import Left from '../../../../assets/images/chevron-left.svg'
import Right from '../../../../assets/images/chevron-right.svg'
import {onChangeEmojis} from "./EmojiPicker";
import {EMOJIS_PER_PAGE} from "../../helpers/consts";

const ShowEmojis = ({emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr, setEmojisArr, current_user, setEmojiObject}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(emojisArr.length / EMOJIS_PER_PAGE);
  const indexOfLastEmoji = currentPage * EMOJIS_PER_PAGE;
  const indexOfFirstEmoji = indexOfLastEmoji - EMOJIS_PER_PAGE;
  const currentEmojis = emojisArr.slice(indexOfFirstEmoji, indexOfLastEmoji);
  const onClickEmoji = (item) => {
    setEmojiObject(Object.assign({}, emojiObject, {id: item.current_user_emoji?.id}))
    setSelectedEmoji(item.emoji_code);
    setSelectedEmojiName(item.emoji_name)
  }

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (isEmptyStr(emojiObject.emoji_code)) return;

    onChangeEmojis(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject)
  }, [emojiObject.emoji_code])

  return <Fragment>
    {currentEmojis.map((item, index) => (
      <div className='padding-x4' onClick={() => onClickEmoji(item)} key={index}>
        <Tippy content={
          <div className='emoji-tooltip'>
            <Emoji
              unified={item.emoji_code}
              emojiStyle={EmojiStyle.NATIVE}
              size={40}
            /><br/>
            {usersEmoji(item.users, current_user, item)}
          </div>
        }>
          <div className='pointer'>
            <Emoji
              unified={item.emoji_code}
              emojiStyle={EmojiStyle.NATIVE}
              size={22}
            />
            <span className='h6 text-muted' style={{marginLeft: 2}}>{item.count}</span>
          </div>
        </Tippy>
      </div>
    ))}
    {emojisArr.length > EMOJIS_PER_PAGE && (
      <div>
        {currentPage > 1 && <Tippy content={<div className='emoji-tooltip'>Previous emojis</div>}>
          <img className='padding-x2 pointer' alt='left' src={Left} onClick={handlePrevPage} />
        </Tippy>}
        {currentPage < totalPages && <Tippy content={<div className='emoji-tooltip'>Next emojis</div>}>
         <img className='padding-x2 pointer' alt='right' src={Right} onClick={handleNextPage}/>
        </Tippy>}
      </div>
    )}
  </Fragment>
}

export default ShowEmojis