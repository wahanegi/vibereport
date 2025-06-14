import React, {Fragment} from "react";
import parse from 'html-react-parser'
import { userFullName } from "./library";

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

  const start_date = new Date(tp.first_working_day)
  const end_date = new Date(tp.last_working_day)

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

export const shortMonth = (date) => date.toLocaleString('en-US', {month: 'short'})

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
    return !isEmpty(arr) && arr[arr.length - 1];
}

export function insertSpanBeforeElements(users) {
    return users.map(function (user) {
        return userFullName(user);
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
        ...user, display_name: user.id === current_user.id ? 'you' : user.first_name
    }));
    const userCount = modifiedUsers.length;
    if (userCount === 0) return '';

    const formatUsers = (usersList) => {
        const userNames = usersList.map(user => user.display_name);
        const lastUser = userNames.pop();
        return userNames.length > 0
            ? `${userNames.join(', ')} and ${lastUser}`
            : lastUser;
    };
    const usersText = formatUsers(modifiedUsers);
    return (
        <Fragment>
            {capitalizeFirstLetter(usersText)}&nbsp;
            <span className='gray-200'>reacted with :{emojiObject.emoji_name}:</span>
        </Fragment>
    );
}

export function gifUrlWithId(id) {
    return 'https://media.giphy.com/media/' + id + '/giphy.gif'
}

const productivityLevels = {
    0: "No productivity",
    4: "Weak productivity",
    7: "Moderate productivity",
    9: "Strong productivity",
};

export function getProductiveText(value) {
    const keys = Object.keys(productivityLevels)
    const max = keys[keys.length - 1]
    const min = keys[0]

    if (value < min || value > max) {
        throw new Error(`Invalid value: ${value}`);
    }

    return productivityLevels[keys.find(max => value <= max)];
}

export function getRandomInteger(min, max) {
    if (min > max) {
        throw new Error(`Invalid range: ${min} > ${max}`);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const validateRow = (row) => {
    return (
      row.company?.trim() &&
      row.project_id?.trim() &&
      row.project_name?.trim() &&
      row.time &&
      !isNaN(row.time) &&
      Number(row.time) > 0
    );
  };

export const calculateWordCount = (text) => {
  return text
    .replace(/<span[^>]*>@[^<]*<\/span>/g, '')
    .trim()
    .split(' ')
    .filter((word) => {
        const cleanedWord = word.replace(/[^\w']+/g, '');
        return cleanedWord
      }).length;
}

export const reformatDate = (date) => {
    let dt = new Date(date);
    let options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(dt);
};
  
export const calculateBillableHours = (rows, projects) => {
  return rows.reduce((total, row) => {
    const project = projects.find((p) => p.id === row.project_id);
    const hours = parseInt(row.time, 10) || 0;
    return project?.attributes.usage === 'billable' ? total + hours : total;
  }, 0);
};

export const transformTimesheetEntry = (entry, includedProjects = []) => {
  const projectId = entry.relationships?.project?.data?.id;
  const project = includedProjects.find((p) => p.id === projectId);

  return {
    id: entry.id,
    company: project?.attributes.company || '',
    project_id: projectId || '',
    project_name: project?.attributes.name_with_code || '',
    time: entry.attributes.total_hours?.toString() || '',
  };
};

export const updateRowData = (rows, id, updates) => {
  return rows.map((row) => (row.id === id ? { ...row, ...updates } : row));
};