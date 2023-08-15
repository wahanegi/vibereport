import React, {useEffect} from 'react';
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import axios from "axios";
import {isEmptyStr, isPresent} from "../../../helpers/helpers";

const createEmoji = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, setEmojiObject) => {
  axios.post(`/api/v1/emojis`, {emoji_object: emojiObject})
    .then(res => {
      const emoji_code = res.data.data.emoji_data.emoji_code
      const updatedData = emojisArr.map(item => {
        if (item.emoji_code !== emojiObject.emoji_code) return item;

        return Object.assign({}, item, {
          emoji_code: item.emoji_code,
          emoji_name: item.emoji_name,
          count: item.count + 1,
          current_user_emoji: res.data.data.emoji_data,
          users: [...item.users, res.data.data.user]
        });
      });
      const addedEmoji = {
        emoji_code: emoji_code,
        emoji_name: res.data.data.emoji_data.emoji_name,
        count: 1,
        current_user_emoji: res.data.data.emoji_data,
        users: [res.data.data.user]
      };
      const addedData = [addedEmoji, ...emojisArr]
      setEmojisArr(emojisArr.some(el => el.emoji_code === emoji_code) ? updatedData : addedData)
      setSelectedEmoji('')
      setEmojiObject({})
    })
}

const removeEmoji = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject) => {
  axios.delete(`/api/v1/emojis/${emojiObject.id}`)
    .then(res => {
      if (res.data.message !== 'success') return;

      const updatedData = emojisArr.map(item => {
        if (item.emoji_code !== emojiObject.emoji_code) return item;

        const newUsers = item.users.filter(user => user.id !== current_user.id)
        return Object.assign({}, item, {
          emoji_code: item.count > 1 ? item.emoji_code : null,
          emoji_name: item.emoji_name,
          count: item.count - 1,
          users: newUsers
        });
      });

      setEmojisArr(updatedData.filter(item => item.emoji_code))
      setSelectedEmoji('')
      setEmojiObject({})
    })
}
export const onChangeEmojis = (emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user = {}, setEmojiObject) => {
  const repeatEmoji = emojisArr.filter(item => item.emoji_code === emojiObject.emoji_code)
  const reactedUser = repeatEmoji.find(item => item.users.some(user => user.id === current_user.id))
  isPresent(reactedUser) ?
    removeEmoji(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject) :
    createEmoji(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, setEmojiObject)
}

const EmojiPickerComponent = React.forwardRef(({
                        emojiObject, setSelectedEmoji, current_user, pickerPosition,
                        emojisArr, setEmojisArr, setEmojiObject, setSelectedEmojiName
                      }, ref) => {
  const onClick = (emojiData) => {
    const repeatEmoji = emojisArr.filter(item => item.emoji_code === emojiData.unified)
    const reactedUser = repeatEmoji.find(item => item.users.some(user => user.id === current_user.id))
    setEmojiObject(Object.assign({}, emojiObject, {id: reactedUser?.current_user_emoji?.id}))
    setSelectedEmoji(emojiData.unified);
    setSelectedEmojiName(emojiData.names[0])
  }

  useEffect(() => {
    if (isEmptyStr(emojiObject.emoji_code)) return;

    onChangeEmojis(emojiObject, emojisArr, setEmojisArr, setSelectedEmoji, current_user, setEmojiObject)
  }, [emojiObject.emoji_code])

  return <div ref={ref} className='emoji-picker' style={pickerPosition}>
    <EmojiPicker
      onEmojiClick={onClick}
      autoFocusSearch={false}
      emojiStyle={EmojiStyle.NATIVE} />
  </div>
})

export default EmojiPickerComponent
