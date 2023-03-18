export const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export const backHandling = () => {
  window.history.back()
}

export const rangeFormat = (tp) => {
  let start_date = new Date(tp.start_date)
  let end_date = new Date(tp.end_date)
  let month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
  return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
}