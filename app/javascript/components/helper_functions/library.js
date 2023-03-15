// For correctly displays elements with the word which more than 12 chars
export function special_prop(word, attr) {
  const minWidth = 130
  const maxWidth = 175
  const maxChars = 15
  const charWidth = maxWidth/maxChars;
  const standardLength = minWidth/charWidth
  const standardMargin = 25
  const top_bottomMargin = 5

switch (attr) {
  case 'width':
    return word.length > standardLength ? word.length * charWidth + 'px' : minWidth
  case 'margin':
    return word.length > standardLength
      ? top_bottomMargin + "px " + (standardMargin - (((word.length * charWidth) - minWidth) / 2.0)) + 'px'
      : top_bottomMargin + "px " + standardMargin + 'px'
  default:
    // wrong attribute
    return 0
  }
}

// For unite the received data with data in our app
export  const mergeData = (receivedData, data, setData) =>{
  setData({
    ...data,
    response: {
      ...data.response,
      attributes: {
        ...receivedData.data.attributes}},
    chosenEmotion:{
      ...receivedData.chosen_emotion}
  })
}
