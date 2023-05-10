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
  if (isBlank(tp)) return null

  const start_date = new Date(tp.start_date)
  const end_date = new Date(tp.end_date)
  const month_start = shortMonth(start_date)
  const month_end = shortMonth(end_date)
  if (month_start === month_end) {
    return `${start_date.getDate()}-${end_date.getDate()} ${month_start}`
  } else {
    return `${datePrepare(start_date)} - ${datePrepare(end_date)}`
  }
}

export const datePrepare = (time) => {
  const date = new Date(time)
  const month = shortMonth(date)
  return `${month} ${date.getDate()}`
}

export const shortMonth = (date) => date.toLocaleString('en-GB', {month: 'short'})

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

export function splitArray(arr, n) {
  const len = arr.length;
  const result = [];

  for (i = 0; i < len; i += n) {
    result.push(arr.slice(i, i + n));
  }

  return result;
}