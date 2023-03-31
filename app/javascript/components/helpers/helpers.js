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
  let start_date = new Date(tp.start_date)
  let end_date = new Date(tp.end_date)
  let month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
  return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function groupImagesByHeight(images) {
  const groups = {};

  images.forEach((image) => {
    const height = image.height;
    if (!groups[height]) {
      groups[height] = [image];
    } else {
      groups[height].push(image);
    }
  });
  const gifs = [];
  Object.keys(groups).forEach((key) => {
    groups[key].forEach((image) => {
      gifs.push(image);
    });
  });

  return gifs;
}