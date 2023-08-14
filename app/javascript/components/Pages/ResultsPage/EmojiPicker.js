import React, {useEffect} from 'react';
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import axios from "axios";
import {isEmptyStr, isPresent} from "../../helpers/helpers";

const createEmoji = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, setEmojiObject) => {
  axios.post(`/api/v1/emojis`, {emoji_object: emojiObject})
    .then(res => {
      const emoji = res.data.data.emoji_data.emoji
      const updatedData = emojisArr.map(item => {
        if (item.emoji === emoji) {
          return Object.assign({}, item, {
            emoji: item.emoji,
            count: item.count + 1,
            current_user_emoji: res.data.data.emoji_data,
            users: [...item.users, res.data.data.user]
          });
        }  else {
          return item;
        }
      });
      const addedEmoji = {
        emoji: emoji,
        count: 1,
        current_user_emoji: res.data.data.emoji_data,
        users: [res.data.data.user]
      };
      const addedData = [addedEmoji, ...emojisArr]
      setEmojisArr(emojisArr.some(el => el.emoji === emoji) ? updatedData : addedData)
      setSelectedEmoji('')
      setEmojiObject({})
    })
}

const removeEmoji = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject) => {
  axios.delete(`/api/v1/emojis/${emojiObject.id}`)
    .then(res => {
      if (res.data.message === 'success') {
        const updatedData = emojisArr.map(item => {
          if (item.emoji === emojiObject.emoji) {
            const newUsers = item.users.filter(user => user.id !== current_user.id)
            if (item.count < 2) return {};

            return Object.assign({}, item, {
              emoji: item.emoji,
              count: item.count - 1,
              users: newUsers
            });
          }  else {
            return item;
          }
        });
        setEmojisArr(updatedData.filter(item => item.emoji))
        setSelectedEmoji('')
        setEmojiObject({})
      }
    })
}
export const onChangeEmojis = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user = {}, setEmojiObject) => {
  const repeatEmoji = emojisArr.filter(item => item.emoji === emojiObject.emoji)
  const reactedUser = repeatEmoji.find(item => item.users.some(user => user.id === current_user.id))
  isPresent(reactedUser) ?
    removeEmoji(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject) :
    createEmoji(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, setEmojiObject)
}

const EmojiPickerComponent = React.forwardRef(({
                        emojiObject, setSelectedEmoji, current_user,
                        emojisArr, setEmojisArr, setEmojiObject
                      }, ref) => {
  const onClick = (emojiData) => {
    const repeatEmoji = emojisArr.filter(item => item.emoji === emojiData.unified)
    const reactedUser = repeatEmoji.find(item => item.users.some(user => user.id === current_user.id))
    setEmojiObject(Object.assign({}, emojiObject, {id: reactedUser?.current_user_emoji?.id}))
    setSelectedEmoji(emojiData.unified);
  }

  useEffect(() => {
    if (isEmptyStr(emojiObject.emoji)) return;

    onChangeEmojis(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject)
  }, [emojiObject.emoji])

  return <div ref={ref} className='emoji-picker'>
    <EmojiPicker
      onEmojiClick={onClick}
      autoFocusSearch={false}
      emojiStyle={EmojiStyle.APPLE} />
  </div>
})

export default EmojiPickerComponent
