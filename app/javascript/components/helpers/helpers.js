export const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export function isBlank(obj) {
  return typeof obj === 'undefined' || obj === null;
}

export function isPresent(obj) {
  return typeof obj !== 'undefined' && obj !== null;
}

export const backHandling = () => {
  window.history.back()
}

export const rangeFormat = (tp) => {
  const start_date = new Date(tp.start_date)
  const end_date = new Date(tp.end_date)
  const month_start = start_date.toLocaleString('en-GB', {month: 'long'}).slice(0,3)
  const month_end = end_date.toLocaleString('en-GB', {month: 'long'}).slice(0,3)
  if (month_start === month_end) {
    return `${start_date.getDate()}-${end_date.getDate()} ${month_start}`
  } else {
    return `${month_start} ${start_date.getDate()} - ${month_end} ${end_date.getDate()}`
  }
}

export const datePrepare = (time) => {
  const date = new Date(time)
  const month = date.toLocaleString('en-GB', {month: 'long'}).slice(0,3)
  return `${month} ${date.getDate()}`.padStart(2, '0')
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sortImagesByHeight(images) {
  return images.sort((a, b) => a.height - b.height);
}

export function isEmptyStr(str) {
  return isBlank(str) || str.trim() === '';
}

export function isNotEmptyStr(str) {
  return isPresent(str) && str.trim() !== '';
}

export function lastEl(arr) {
  return !isEmpty(arr) && arr[arr.length-1];
}