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
      ...receivedData.emotion}
  })
}

//For set up caret to the defiantly position
export function bindHighlightUserInText(element, event, users, enteredValue, setEnteredValue, caret, setCaret, toggle, setToggle) {

}

//For set up caret to the defiantly position

export default class Cursor {
  static getCurrentCursorPosition(parentElement) {
    const selection = window.getSelection()
    let  charCount = -1
    let focusNode = null
    let  node = null
    let focusOffset = null
    let realPos = 0

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        focusNode = selection.focusNode;
        node = focusNode;
        focusOffset = selection.focusOffset
        charCount = focusOffset;
        realPos += focusNode.parentNode.tagName === 'SPAN' ?
          focusNode.parentNode.outerHTML.length - '</span>'.length - focusNode.textContent.length : 0


        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
            realPos += (node.outerHTML === undefined ? node.textContent : node.outerHTML).length
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return {charCount: charCount , focusNode: focusNode, focusOffset: focusOffset, realPos: realPos + focusOffset};
  }

  static setCurrentCursorPosition(chars, element) {
    if (chars >= 0) {
      const selection = window.getSelection();

      let range = Cursor._createRange(element, { count: chars });

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  static _createRange(node, chars, range) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (let lp = 0; lp < node.childNodes.length; lp++) {
          range = Cursor._createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  }

  static _isChildOf(node, parentElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }
}

export const firstLastName = user => user.last_name === '' ?  user.first_name :  `${user.first_name} ${user.last_name}`