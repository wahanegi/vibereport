// For correctly displays elements with the word which more than 12 chars
export function specialProp(word, attr) {
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
    emotion:{
      ...receivedData.emotion},
    my_shout_outs_to_other: [
      ...receivedData.my_shout_outs_to_other
    ]
  })
}


export const userFullName = user => {
  if ( !user ) { return }
  return user.last_name === '' ?  user.first_name :  `${user.first_name} ${user.last_name}`
}