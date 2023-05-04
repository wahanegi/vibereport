//For set up caret to the defiantly position

import RichText from "./rich-text";

export default class Cursor {

    static getCurrentCursorPosition(parentElement) {

        if(window.getSelection()) {
            const selection = window.getSelection()
            let charCount = -1
            let focusNode = null
            let node = null
            let focusOffset = null
            let realPos = 0
            let realFocusOffset
            let coordinates = {x: 0, y: 0};


            if (selection.focusNode) {
                if (Cursor._isChildOf(selection.focusNode, parentElement)) {
                    focusNode = selection.focusNode;
                    node = focusNode;
                    focusOffset = selection.focusOffset
                    charCount = focusOffset;
                    realPos += focusNode.parentNode.tagName === 'SPAN' ?
                        focusNode.parentNode.outerHTML.length - '</span>'.length -
                        RichText.encodeSpace(RichText.decodeSpace160(focusNode.textContent)).length : 0
                    realFocusOffset = RichText.encodeSpace(RichText.decodeSpace160(focusNode.textContent.slice(0, focusOffset))).length

                    while (node) {
                        if (node === parentElement) {
                            break;
                        }

                        if (node.previousSibling) {
                            node = node.previousSibling;
                            charCount += node.textContent.length;
                            realPos +=
                                (node.outerHTML === undefined ? RichText.encodeSpace(RichText.decodeSpace160(node.textContent)) : node.outerHTML).length
                        } else {
                            node = node.parentNode;
                            if (node === null) {
                                break;
                            }
                        }
                    }
                }
            }

            if (selection.rangeCount) {
                let range = selection.getRangeAt(0).cloneRange();

                if (range.getClientRects) {
                    range.collapse(true);
                    let rects = range.getClientRects();

                    if (rects.length > 0) {
                        let rect = rects[0];
                        coordinates.x = rect.left ;
                        coordinates.y = rect.top ;
                    }
                }
            }

            return {
                charCount: charCount,
                focusNode: focusNode,
                focusOffset: focusOffset,
                realPos: realPos + realFocusOffset,
                realFocusOffset: realFocusOffset,
                isDIV: focusNode !== null ? focusNode.parentNode.tagName === 'DIV' : false,
                isSPAN: focusNode !== null ? focusNode.parentNode.tagName === 'SPAN' : false,
                coordinates
            }
        }
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