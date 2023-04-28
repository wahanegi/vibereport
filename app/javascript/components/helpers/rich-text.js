
export default class RichText {

  static userFullName = user => user.last_name === '' ?  user.first_name :  `${user.first_name} ${user.last_name}`

  static decodeSpace = html => {
    return html.replace(/&nbsp;/g, " ")
  }

  static decodeSpace160 = html => {
    return html.replace(/\u00A0/g, " ")
  }

  static encodeSpace = html => {
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

  static deleteNextChar(str, cursorPosition, obj) {
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

  static deletePreviousChar (str, cursorPosition, obj) {
    if ( cursorPosition <= 0 ) { return }
    let n=1
    if(cursorPosition>=6 && str.slice(cursorPosition-6, cursorPosition ) === "&nbsp;") { n = 6 }
    return obj( str.slice(0, cursorPosition-n) + str.slice(cursorPosition) )

  }
  static pasteCharsToString( chars, str,  startPos, endPos = startPos) {
    return str.slice(0, startPos) + chars + str.slice(endPos)
  }
  static  pasteSymbolsToHTMLobj(symbols, htmlText, cursorPos, setObjHTML, setCaret) {
    setObjHTML(this.encodeSpace(htmlText.slice(0, cursorPos.realPos) + this.encodeSpace(symbols) + htmlText.slice(cursorPos.realPos)))
    setCaret(cursorPos.charCount  + symbols.length)
  }

  static  pasteNodeToHTMLobj(symbols, htmlText, cursorPos, setObjHTML, setCaret, tag, endTag) {
    setObjHTML(this.encodeSpace(htmlText.slice(0, cursorPos.realPos) + tag +
        this.encodeSpace(symbols) + endTag + htmlText.slice(cursorPos.realPos)))
    setCaret(cursorPos.charCount  + symbols.length)
  }

  static deleteString( string, startPos, endPos ) {
    return string.slice(0, startPos) + string.slice(endPos)
  }

  static incrementPositionCursor (numChars, cursorPos, text, obj = ()=>{}) {
    obj( cursorPos.charCount + numChars < text.length ? cursorPos.charCount + numChars : text.length )
  }
  
  static decrementPositionCursor (numChars, cursorPos, obj = ()=>{}) {
    obj( cursorPos.charCount > numChars  ? cursorPos.charCount - numChars : 0 )
  }

  static deleteNode( node, cursorPos, tag, endTag, setObjHTML, setCaret){
    const startPos =
        cursorPos.isSPAN ? cursorPos.realPos - cursorPos.realFocusOffset  - tag.length + 1 : cursorPos.realPos
    const endPos  = node.indexOf(endTag, cursorPos.realPos ) + endTag.length
    console.log(startPos, endPos, this.deleteString(node, startPos, endPos) , cursorPos.focusOffset , cursorPos)
    setObjHTML(this.deleteString(node, startPos, endPos))
    setCaret(cursorPos.isSPAN ? cursorPos.charCount - cursorPos.focusOffset : cursorPos.charCount)
    // this.decrementPositionCursor(cursorPos.focusOffset , cursorPos, setCaret)
  }

  static deleteNodePasteChars( node, cursorPos, chars, tag, endTag, setObjHTML, setCaret){
    const startPos = cursorPos.realPos - cursorPos.realFocusOffset  - tag.length + 1
    const endPos  = node.indexOf(endTag, cursorPos.realPos ) + endTag.length
    let newHtmlTxt = this.deleteString(node, startPos, endPos)
    setObjHTML(this.pasteCharsToString( chars, newHtmlTxt, startPos))
    this.incrementPositionCursor( chars.length -1 , cursorPos, newHtmlTxt, setCaret)
  }
}
