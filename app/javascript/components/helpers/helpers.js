import React, {Fragment} from "react";
import parse from 'html-react-parser'

export const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export function isBlank(obj) {
  return typeof obj === 'undefined' || obj === null || (typeof obj === 'object' && Object.keys(obj).length === 0);
}

export function isPresent(obj) {
  return typeof obj !== 'undefined' && obj !== null && !(typeof obj === 'object' && Object.keys(obj).length === 0);
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

function lastEl(arr) {
  return !isEmpty(arr) && arr[arr.length-1];
}

export function insertSpanBeforeElements(users) {
  return users.map(function (user) {
    return "<span class='color-rose'>@</span>" + user.first_name;
  });
}

export function convertUsersToString(users) {
  if (users.length === 0) {
    return '';
  } else if (users.length === 1) {
    return <Fragment>
      {parse(insertSpanBeforeElements(users).join())}:&nbsp;
    </Fragment>
  } else if (users.length === 2) {
    return <Fragment>
      {parse(insertSpanBeforeElements(users).join(' and '))}:&nbsp;
    </Fragment>
  } else {
    const lastElement = lastEl(users);
    const popUsers = users.slice(0, -1)
    return <Fragment>
      {
        parse(insertSpanBeforeElements(popUsers).join(', ') + ', and ' +
        insertSpanBeforeElements(Array(lastElement)).join(''))
      }:&nbsp;
    </Fragment>
  }
}

export function usersEmoji(users, current_user, emojiObject) {
  const modifiedUsers = users.map(user => ({
    ...user,
    first_name: user.id === current_user.id ? 'you' : user.first_name
  }));

  if (modifiedUsers.length === 0) {
    return '';
  } else if (modifiedUsers.length === 1) {
    return (
      <Fragment>
        {capitalizeFirstLetter(modifiedUsers[0].first_name)}
        &nbsp;<span className='gray-200'>reacted with :{emojiObject.emoji_name}:</span>
      </Fragment>
    );
  } else if (modifiedUsers.length === 2) {
    return (
      <Fragment>
        {capitalizeFirstLetter(modifiedUsers.map(user => user.first_name).join(' and '))}
        &nbsp;<span className='gray-200'>reacted with :{emojiObject.emoji_name}:</span>
      </Fragment>
    );
  } else {
    const lastUser = modifiedUsers[modifiedUsers.length - 1];
    const otherUsers = modifiedUsers.slice(0, -1);
    const totalText = otherUsers.map(user => user.first_name).join(', ') + ', and ' + lastUser.first_name
    return (
      <Fragment>
        {capitalizeFirstLetter(totalText)}&nbsp;<span className='gray-200'>reacted with :{emojiObject.emoji_name}:</span>
      </Fragment>
    );
  }
}