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
    let charCount = -1
    let focusNode = null
    let node = null
    let focusOffset = null
    let realPos = 0
    let realFocusOffset

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        focusNode = selection.focusNode;
        node = focusNode;
        focusOffset = selection.focusOffset
        charCount = focusOffset;
        realPos += focusNode.parentNode.tagName === 'SPAN' ?
        focusNode.parentNode.outerHTML.length - '</span>'.length - encodeSpace(decodeSpace160(focusNode.textContent)).length : 0
        console.log(realPos,focusNode.parentNode.outerHTML, encodeSpace(decodeSpace160(focusNode.textContent)) )
        realFocusOffset  = encodeSpace(decodeSpace160(focusNode.textContent.slice(0, focusOffset))).length
        console.log(realFocusOffset)


        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
            realPos +=
              (node.outerHTML === undefined ? encodeSpace(decodeSpace160(node.textContent) ) : node.outerHTML).length
            console.log(realPos, node.outerHTML === undefined ? encodeSpace(decodeSpace160(node.textContent) ) : node.outerHTML)
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return {charCount: charCount ,
            focusNode: focusNode,
            focusOffset: focusOffset,
            realPos: realPos + realFocusOffset,
            realFocusOffset: realFocusOffset,
            isDIV: focusNode !== null ? focusNode.parentNode.tagName ==='DIV' : false,
            isSPAN: focusNode !== null ?  focusNode.parentNode.tagName ==='SPAN'  : false };
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

export const userFullName = user => user.last_name === '' ?  user.first_name :  `${user.first_name} ${user.last_name}`

export const decodeSpace = html => {
  return html.replace(/&nbsp;/g, " ")
}

export const decodeSpace160 = html => {
  return html.replace(/\u00A0/g, " ")
}

export const encodeSpace = html => {
  let encodeHtml = ''
  const tag = '<span class="color-primary">@'
  const end = '</span>'
  let posStart = html.indexOf(tag,0)
  let posEnd = 0

  while (posStart >= 0){
    encodeHtml += html.slice(posEnd, posStart).replace(/ /g, "&nbsp;") + tag
    posStart += tag.length
    // if (posStart >= html.length) { break }
    posEnd = html.indexOf(end, posStart)
    if (posEnd < 0) { break }
    encodeHtml += html.slice(posStart, posEnd).replace(/ /g, "&nbsp;") + end
    posEnd += end.length
    posStart = html.indexOf(tag,posEnd)
  }
  if (posEnd !== -1) {encodeHtml += html.slice( posEnd ).replace(/ /g, "&nbsp;")}
  return encodeHtml

}

export function deleteNextChar(str, cursorPosition, obj) {
  if (cursorPosition < str.length) {
    if (str[cursorPosition] === "&" && str[cursorPosition + 1] === "n" && str[cursorPosition + 2] === "b"
      && str[cursorPosition + 3] === "s" && str[cursorPosition + 4] === "p" && str[cursorPosition + 5] === ";") {
      str = str.slice(0, cursorPosition) + str.slice(cursorPosition + 6);
    } else {
      str = str.slice(0, cursorPosition) + str.slice(cursorPosition + 1);
    }
  }
  return obj( str );
}

export function deletePreviousChar (str, cursorPosition, obj) {
  if ( cursorPosition <= 0 ) { return }
  let n= 1
  if(cursorPosition>=6 && str.slice(cursorPosition-6, cursorPosition ) === "&nbsp;") { n = 6 }
  return obj( str.slice(0, cursorPosition-n) + str.slice(cursorPosition) )

}

export function incrementPositionCursor (numChars, cursorPos, text, obj) {
  obj( cursorPos.charCount + numChars < text.length ? cursorPos.charCount + numChars : text.length )
}
export function decrementPositionCursor (numChars, cursorPos, obj) {
  obj( cursorPos.charCount > numChars  ? cursorPos.charCount - numChars : 0 )
}

export function  pasteSymbolsToHTMLobj(symbols, htmlText, cursorPos, setObjHTML, setCaret) {
  setObjHTML(encodeSpace(htmlText.slice(0, cursorPos.realPos) + encodeSpace(symbols) + htmlText.slice(cursorPos.realPos)))
  setCaret(cursorPos.charCount  +symbols.length)
}

export function deleteString( string, startPos, endPos ) {
  return string.slice(0, startPos) + string.slice(endPos)
}

export function deleteNode( node, cursorPos, tag, endTag, setObjHTML, setCaret){
  // const deleteString = ( string, startPos, endPos ) => {string.slice(0, startPos) + string.slice(endPos)}
  const startPos = cursorPos.realPos - cursorPos.realFocusOffset  - tag.length + 1
  const endPos  = node.indexOf(endTag, cursorPos.realPos ) + endTag.length
  setObjHTML(deleteString(node, startPos, endPos))
  setCaret( cursorPos.charCount - cursorPos.focusOffset  )
}


// (/ /g, "\u00A0")
//.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\t/g, "\u00a0").replace(/\n/g, '<br/>')