export const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export function isBlank(obj) {
  return typeof obj === 'undefined' || obj === null || obj === 0;
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
  const month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
  return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sortImagesByHeight(images) {
  return images.sort((a, b) => a.height - b.height);
}