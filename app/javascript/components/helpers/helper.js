export const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export const backHandling = () => {
  window.history.back()
}