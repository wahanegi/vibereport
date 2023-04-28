import {decodeSpace, encodeSpace, userFullName} from "./library";

export default class RichText {
  
  static filtrationById = ( separatorArr, mainArr ) => {
    if ( !separatorArr.length ) {return mainArr}
    return mainArr.filter(item=> !separatorArr.some(({ id }) => id === item.id))
  }

  static filtrationByName = ( fullName, users ) => {
    return users.filter( user => this.userFullName(user) !== fullName )
  }

  static searchUsersByFirstLetters = ( str, users ) => {
    return users.filter( user => this.userFullName(user).toLowerCase().startsWith(str) )
  }

  static contentBtwTags = ( htmlText, cursorPos, endTag, startFrom = 0 ) => {
    return this.decodeSpace(htmlText.slice(
        cursorPos.realPos-cursorPos.realFocusOffset + startFrom,
        htmlText.indexOf(endTag, cursorPos.realPos)
    ))
  }
   static pasteContentBtwTags = ( content, htmlText, cursorPos, endTag, startFrom = 0 ) => {
    return  encodeSpace(htmlText.slice(0, cursorPos.realPos - cursorPos.realFocusOffset + startFrom ) +
        encodeSpace( content ) + htmlText.slice(htmlText.indexOf(endTag, cursorPos.realPos)))
   }

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

  static deleteNode( htmlStr, cursorPos, tag, endTag, setObjHTML, setCaret){
    const startPos =
        cursorPos.isSPAN ? cursorPos.realPos - cursorPos.realFocusOffset  - tag.length + 1 : cursorPos.realPos
    const endPos  = htmlStr.indexOf(endTag, cursorPos.realPos ) + endTag.length
    console.log(startPos, endPos, this.deleteString(htmlStr, startPos, endPos) , cursorPos.focusOffset , cursorPos)
    setObjHTML(this.deleteString(htmlStr, startPos, endPos))
    setCaret(cursorPos.isSPAN ? cursorPos.charCount - cursorPos.focusOffset : cursorPos.charCount)
    return htmlStr.slice(startPos, endPos)
  }

  static deleteNodePasteChars( htmlStr, cursorPos, chars, tag, endTag, setObjHTML, setCaret){
    const startPos = cursorPos.realPos - cursorPos.realFocusOffset  - tag.length + 1
    const endPos  = htmlStr.indexOf(endTag, cursorPos.realPos ) + endTag.length
    let newHtmlTxt = this.deleteString(htmlStr, startPos, endPos)
    setObjHTML(this.pasteCharsToString( chars, newHtmlTxt, startPos))
    this.incrementPositionCursor( chars.length -1 , cursorPos, newHtmlTxt, setCaret)
  }

  static findUsersInText( tag, endTag, richText, listUsers) {
      const users = []
      let pos = 0
      while ((pos = richText.indexOf(tag, pos)) !== -1) {
        pos += + tag.length
        users.push(listUsers.find(user => userFullName(user) === richText.slice(pos, richText.indexOf(endTag, pos))))
      }
      return users
  }
}
