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