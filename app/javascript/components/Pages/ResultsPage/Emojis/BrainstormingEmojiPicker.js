import React from "react";
import { BRAINSTORMING_ALLOWED_EMOJIS } from "../../../helpers/consts";

const BrainstormingEmojiPicker = React.forwardRef(({
  pickerPosition,
  emojisArr,
  current_user,
  emojiObject,
  setEmojiObject,
  setSelectedEmoji,
  setSelectedEmojiName,
  setPickerPosition
}, ref) => {
  const handleEmojiSelect = (emoji) => {
    const repeatEmoji = emojisArr.filter(item => item.emoji_code === emoji.unified);
    const reactedUser = repeatEmoji.find(item =>
      item.users.some(user => user.id === current_user.id)
    );

    setEmojiObject({
      ...emojiObject,
      id: reactedUser?.current_user_emoji?.id
    });
    setSelectedEmoji(emoji.unified);
    setSelectedEmojiName(emoji.name);
    setPickerPosition({});
  };

  return (
    <div
      ref={ref}
      className="d-flex flex-column flex-nowrap gap-1 emoji-picker brainstorming-emoji-picker position-absolute border border-gray-150 rounded bg-white shadow p-1"
      style={pickerPosition}
    >
      {BRAINSTORMING_ALLOWED_EMOJIS.map((emoji) => (
        <div
          key={emoji.unified}
          role="button"
          className="d-flex align-items-center justify-content-start gap-1 rounded-3 border-0 text-start bg-hover-blue-50"
          style={{ padding: "8px" }}
          onClick={() => handleEmojiSelect(emoji)}
        >
          <span style={{ fontSize: 20 }}>
            {String.fromCodePoint(parseInt(emoji.unified, 16))}
          </span>
          <span className="text-nowrap " style={{ fontSize: 20 }}>{emoji.name}</span>
        </div>
      ))}
    </div>
  );
});

export default BrainstormingEmojiPicker;
