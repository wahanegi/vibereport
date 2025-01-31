import React, { useEffect, useRef, useState } from 'react';
import Cursor from '../rich-text/cursor';
import DropDownList from './DropDownList';
import { userFullName } from '../../helpers/library';
import RichText from './rich-text';
import xClose from '../../../../assets/images/sys_svg/x-close.svg';
import Button from '../Button';
import RichTextArea from './RichTextArea';
import SwitcherShoutouts from '../SwitcherShoutouts';

const RichInputElement = ({
  richText = '',
  listUsers: listAllUsers,
  setChosenUsers = () => {},
  onSubmit,
  classAt = 'color-primary',
  editObj,
}) => {
  const calculateInitX = (window.innerWidth - 884) / 2 + 69;
  const initCoordinates = { x: calculateInitX, y: 373 };
  const [textHTML, setTextHTML] = useState(richText);
  const textAreaRef = useRef(richText);
  const [filteredUsers, setFilteredUsers] = useState(
    RichText.sortUsersByFullName(listAllUsers)
  );
  const [isDropdownList, setIsDropdownList] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [indexOfSelection, setIndexOfSelection] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(
    filteredUsers.length ? filteredUsers[0].id : ''
  );
  const [caret, setCaret] = useState(textAreaRef.current.length);
  const [copyChosenUsers, setCopyChosenUsers] = useState([]);
  const [coordinates, setCoordinates] = useState(initCoordinates);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const element = textAreaRef.current;
  const NON_ALLOWED_CHARS_OF_NAME = /[,@`<>;:\/\\']/;
  const MARKER = '@';
  const TAG_AT = '<span class="' + classAt + '">' + MARKER;
  const END_TAG_AT = '</span>';
  const OFFSET_X = 0;
  const OFFSET_Y = 40;
  const LIMIT_CHARS = 700;
  const highlightSmbATUnknownUser = false;
  const node = highlightSmbATUnknownUser ? TAG_AT + END_TAG_AT : MARKER;
  const [isNotActive, setIsNotActive] = useState(false);
  const [isChecked, setIsChecked] = useState(
    editObj.public === undefined ? true : editObj.public
  );

  useEffect(() => {
    Cursor.setCurrentCursorPosition(caret, textArea);
    if (Cursor.getCurrentCursorPosition(element).focusOffset === 1)
      setCoordinates(Cursor.getCurrentCursorPosition(element).coordinates);
    setCursorPosition(Cursor.getCurrentCursorPosition(element));
    element.innerText === undefined || element.innerText === '\x0A'
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [caret, textHTML, currentSelection]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (!editObj.id) {
      return;
    }
    editObj.public !== isChecked ? setIsDisabled(false) : setIsDisabled(true);
  }, [isChecked]);

  useEffect(() => {
    if (richText.includes(TAG_AT)) {
      let users = RichText.findUsersInText(
        TAG_AT,
        END_TAG_AT,
        RichText.decodeSpace(richText),
        listAllUsers
      );
      setChosenUsers(users);
      setCopyChosenUsers(users);
      setFilteredUsers(RichText.filtrationById(users, listAllUsers));
    }
  }, []);

  const handleKeyDown = (event) => {
    event.preventDefault();
    const selectedValue = window.getSelection().toString();
    const text = element.textContent;
    const cursorPos = Cursor.getCurrentCursorPosition(element, initCoordinates);
    const caretCur = cursorPos.charCount;
    const realPos = cursorPos.realPos;
    let char = event.key;
    if (event.ctrlKey && event.keyCode === 67) {
      return copyToClipboard(selectedValue);
    }
    if (event.ctrlKey && event.keyCode === 86) {
      return paste();
    }
    switch (char.toLowerCase()) {
      case 'enter':
        if (!isDropdownList) char = '\x0A';
        break;
    }

    if (cursorPos.isDIV) {
      setIsDropdownList(false);
    }
    if (cursorPos.isSPAN && textHTML[cursorPos.realPos] !== '<') {
      setIsDropdownList(true);
    }
    if (char.match(/[&<>]/)) return 0;
    if (text.length < LIMIT_CHARS) {
      if (isDropdownList) {
        if (char === 'Escape' || char === MARKER) {
          if (text[caret - 1] === MARKER) {
            RichText.deleteNodePasteChars(
              textHTML,
              cursorPos,
              MARKER,
              TAG_AT,
              END_TAG_AT,
              setTextHTML,
              setCaret
            );
          }
          setIsDropdownList(false);
          return 0;
        }

        if (char === 'Enter' || char === 'Tab') {
          if (indexOfSelection === -1) return;
          clickEnterTabHandling(indexOfSelection);
          return 0;
        }
        let indexOfSel = indexOfSelection;
        if (
          !String.fromCharCode(event.keyCode).match(
            NON_ALLOWED_CHARS_OF_NAME
          ) &&
          char.length === 1
        ) {
          if (
            cursorPos.focusOffset - 1 !== searchString.length ||
            RichText.contentBtwTags(textHTML, cursorPos, END_TAG_AT, 1)
              .length !==
              cursorPos.focusOffset - 1
          )
            return 0;
          const newSearchString = (searchString + char).toLowerCase();
          const listFoundUsers = filteredUsers.filter((user) =>
            userFullName(user).toLowerCase().startsWith(newSearchString)
          );
          const findUser = filteredUsers.find((user) =>
            userFullName(user).toLowerCase().startsWith(newSearchString)
          );
          if (findUser === undefined) {
            transformNodeToSimple(textHTML, cursorPos, newSearchString);
            RichText.incrementPositionCursor(1, cursorPos, textHTML, setCaret);
            setSearchString('');
            return;
          }
          setCurrentSelection(findUser.id);

          //when full name of user to equal to search string
          // and only one element in the array than start update copyChosenUsers and chosenUsers
          if (
            listFoundUsers.length === 1 &&
            userFullName(listFoundUsers[0]).toLowerCase() === newSearchString
          ) {
            //check if user have in the chosenUsers
            if (
              copyChosenUsers.find(
                (user) => userFullName(user) === newSearchString
              )
            )
              return 0;

            setTextHTML(
              RichText.pasteContentBtwTags(
                userFullName(listFoundUsers[0]),
                textHTML,
                cursorPos,
                END_TAG_AT,
                1
              )
            );
            const incrementedNumberChosenUsers = [
              ...copyChosenUsers,
              listFoundUsers[0],
            ];
            setCopyChosenUsers(incrementedNumberChosenUsers);
            setChosenUsers(incrementedNumberChosenUsers);
            setIsDropdownList(false);
            RichText.incrementPositionCursor(
              1,
              cursorPos,
              text + ' ',
              setCaret
            );
            setSearchString('');
            setFilteredUsers(
              RichText.filtrationById(
                incrementedNumberChosenUsers,
                listAllUsers
              )
            );
          } else if (listFoundUsers.length) {
            //delete user from text, Users, ChosenUsers and put instead of it char

            const userToDel = RichText.contentBtwTags(
              textHTML,
              cursorPos,
              END_TAG_AT,
              1
            );
            const decrementedNumberChosenUsers = copyChosenUsers.filter(
              (user) => userFullName(user) !== userToDel
            ); // delete user from chosenUsers
            setCopyChosenUsers(decrementedNumberChosenUsers);
            setChosenUsers(decrementedNumberChosenUsers);
            RichText.pasteCharsBeforeEndTag(
              char,
              textHTML,
              cursorPos,
              END_TAG_AT,
              setTextHTML,
              setCaret
            );
            setSearchString(newSearchString);
            setFilteredUsers(listFoundUsers);
            setIndexOfSelection(0);
          }
          setChosenUsers(
            listAllUsers.filter((item) => !copyChosenUsers.includes(item))
          );
        }

        if (char === 'ArrowDown' && indexOfSelection >= 0) {
          setIndexOfSelection(
            (indexOfSel =
              indexOfSelection < filteredUsers.length - 1 ? ++indexOfSel : 0)
          );
          setCurrentSelection(filteredUsers[indexOfSel]?.id);
          return 0;
        }

        if (char === 'ArrowUp' && indexOfSelection >= 0) {
          setIndexOfSelection(
            (indexOfSel =
              indexOfSelection > 0 ? --indexOfSel : filteredUsers.length - 1)
          );
          setCurrentSelection(filteredUsers[indexOfSel]?.id);
          return 0;
        }
      } else {
        if (cursorPos.isDIV && char.length === 1) {
          if (char === MARKER && filteredUsers?.length) {
            const symbolCodeAt = (pos) => text.charCodeAt(caretCur + pos);
            const isSpecialSmb = (pos) =>
              isNaN(symbolCodeAt(pos)) ? true : symbolCodeAt(pos) < 33;
            const isBtwSpecialSmb = isSpecialSmb(-1) && isSpecialSmb(0);
            if (isBtwSpecialSmb) {
              RichText.pasteNodeToHTMLobj(
                MARKER,
                textHTML,
                cursorPos,
                setTextHTML,
                setCaret,
                TAG_AT.slice(0, -1),
                END_TAG_AT
              );
              setIsDropdownList(true);
              setCoordinates(cursorPos.coordinates);
              return 0;
            }
          }
          RichText.pasteSymbolsToHTMLobj(
            char,
            textHTML,
            cursorPos,
            setTextHTML,
            setCaret
          );
        } else if (cursorPos.isSPAN && char.length === 1) {
          const nameUserToDel = RichText.contentBtwTags(
            textHTML,
            cursorPos,
            END_TAG_AT,
            1
          );
          if (
            listAllUsers.find((user) => userFullName(user) === nameUserToDel) &&
            !char.match(/[@<>]/) &&
            nameUserToDel.length === cursorPos.focusOffset - 1
          ) {
            //if user have in the ListUsers  and cursor at the end of firstLastName of user
            //then dropdown turn off and put chars in the DIV after endTag

            const pos = realPos + END_TAG_AT.length;
            const end = pos === textHTML.length ? '' : textHTML.slice(pos);
            setTextHTML(textHTML.slice(0, pos) + char + end);
            setCaret(caret + 1);
            setIsDropdownList(false);
          } else if (!char.match(/[,@`<>;:\\\/\s]/)) {
            const renewUsers = copyChosenUsers.filter(
              (user) => userFullName(user) !== nameUserToDel
            );
            setCopyChosenUsers(!renewUsers ? [] : renewUsers);
            setChosenUsers(!renewUsers ? [] : [...renewUsers]);
            const filtrationUsersById = RichText.filtrationById(
              renewUsers,
              listAllUsers
            );
            setFilteredUsers(filtrationUsersById);
            if (cursorPos.isSPAN && cursorPos.focusOffset !== 1) {
              transformNodeToSimple(textHTML, cursorPos, char);
            } else {
              RichText.pasteCharsBeforeEndTag(
                char,
                textHTML,
                cursorPos,
                END_TAG_AT,
                setTextHTML,
                setCaret
              );
              setIsDropdownList(true);
              setSearchString(char);
              const findUser = filtrationUsersById.find((user) =>
                userFullName(user).toLowerCase().startsWith(char)
              );
              setCurrentSelection(
                !findUser ? filteredUsers[0].id : findUser.id
              );
              setIndexOfSelection(
                !findUser ? 0 : filtrationUsersById.indexOf(findUser)
              );
            }
            setCaret(caretCur - cursorPos.focusOffset + 2);
          }
        }
        if (
          char.length === 1 &&
          textHTML.length > realPos &&
          textHTML.indexOf(TAG_AT) === realPos &&
          !char.match(/<>&/)
        ) {
          RichText.pasteSymbolsToHTMLobj(
            char,
            textHTML,
            cursorPos,
            setTextHTML,
            setCaret
          );
        }
      }
    }

    switch (char) {
      case 'Home':
        setIsDropdownList(false);
        setCaret(0);
        break;
      case 'End':
        setIsDropdownList(false);
        setCaret(text.length - 1);
        break;
      case 'ArrowLeft':
        if (cursorPos.isSPAN && cursorPos.focusOffset === 1) {
          setIsDropdownList(false);
          setCoordinates(cursorPos.coordinates);
        }
        RichText.decrementPositionCursor(1, cursorPos, setCaret);
        break;

      case 'ArrowRight':
        if (
          cursorPos.isSPAN &&
          cursorPos.focusOffset === 1 &&
          text[cursorPos.charCount] === MARKER
        ) {
          setIsDropdownList(true);
          setCoordinates(cursorPos.coordinates);
        }
        if (cursorPos.isSPAN && textHTML[cursorPos.realPos + 1] === '<')
          setIsDropdownList(false);
        RichText.incrementPositionCursor(1, cursorPos, text, setCaret);
        break;
    }

    if (char === 'Backspace' || char === 'Delete') {
      if (cursorPos.isSPAN && cursorPos.focusNode.textContent === MARKER) {
        const endPos =
          textHTML.indexOf(END_TAG_AT, cursorPos.realPos) + END_TAG_AT.length;
        setTextHTML(
          RichText.deleteString(
            textHTML,
            cursorPos.realPos - TAG_AT.length,
            endPos
          )
        );
        setCaret(caret - 1);
        setIsDropdownList(false);
        return 0;
      }
      if (
        cursorPos.focusNode.textContent.startsWith(MARKER) &&
        cursorPos.isSPAN
      ) {
        let findUser = copyChosenUsers.find(
          (el) =>
            MARKER + userFullName(el) ===
            RichText.decodeSpace(cursorPos.focusNode.textContent)
        );
        if (findUser) {
          const newListUser = copyChosenUsers.filter(
            (user) => user.id !== findUser.id
          );
          setChosenUsers(newListUser);
          setCopyChosenUsers(newListUser);
          const sortUsers = RichText.sortUsersByFullName([
            ...filteredUsers,
            findUser,
          ]);
          setFilteredUsers(sortUsers);
          setIndexOfSelection(0);
          setCurrentSelection(sortUsers[0].id);
          RichText.deleteNode(
            textHTML,
            cursorPos,
            TAG_AT,
            END_TAG_AT,
            setTextHTML,
            setCaret
          );
          event.preventDefault();
          setIsDropdownList(false);
        } else {
          if (char === 'Backspace') {
            const updateSearchString = searchString.slice(0, -1);
            RichText.deletePreviousChar(textHTML, realPos, setTextHTML);
            RichText.decrementPositionCursor(1, cursorPos, setCaret);
            const foundUsersByFirstLetters = RichText.searchUsersByFirstLetters(
              updateSearchString,
              RichText.filtrationById(copyChosenUsers, listAllUsers)
            );
            setSearchString(updateSearchString);
            setFilteredUsers(foundUsersByFirstLetters);
          }
        }
      } else {
        switch (char) {
          case 'Delete':
            if (textHTML.indexOf(TAG_AT, realPos) === realPos) {
              const node = RichText.deleteNode(
                textHTML,
                cursorPos,
                TAG_AT,
                END_TAG_AT,
                setTextHTML,
                setCaret
              );
              const userFromNode = cursorPos.isSPAN
                ? node
                : RichText.findUsersInText(
                    TAG_AT,
                    END_TAG_AT,
                    RichText.decodeSpace(node),
                    listAllUsers
                  );
              if (userFromNode?.length) {
                const filtratedUsersByName = RichText.filtrationByName(
                  userFullName(userFromNode[0]),
                  copyChosenUsers
                );
                setCopyChosenUsers(filtratedUsersByName);
                setChosenUsers(filtratedUsersByName);
                setFilteredUsers(
                  RichText.sortUsersByFullName([
                    ...filteredUsers,
                    userFromNode[0],
                  ])
                );
              }
            } else {
              RichText.deleteNextChar(textHTML, realPos, setTextHTML);
            }
            break;
          case 'Backspace':
            RichText.deletePreviousChar(textHTML, realPos, setTextHTML);
            RichText.decrementPositionCursor(1, cursorPos, setCaret);
            break;
        }
      }
    }
  };

  const transformNodeToSimple = (textHTML, cursorPos, char) => {
    RichText.deleteNodePasteChars(
      textHTML,
      cursorPos,
      node + char.charAt(0).toUpperCase() + char.slice(1),
      TAG_AT,
      END_TAG_AT,
      setTextHTML,
      setCaret
    );
    setIsDropdownList(false);
  };

  const clickEnterTabHandling = (i) => {
    if (i === undefined) {
      setIsDropdownList(false);
      return 0;
    }
    const cursorPos = cursorPosition;
    const realPos = cursorPos.realPos;
    let chosenUsersWithoutNemo = copyChosenUsers;
    const nemoFromTextArea = RichText.contentBtwTags(
      textHTML,
      cursorPos,
      END_TAG_AT,
      1
    );
    if (
      copyChosenUsers.find((user) => userFullName(user) === nemoFromTextArea)
    ) {
      chosenUsersWithoutNemo = copyChosenUsers.filter(
        (user) => userFullName(user) !== nemoFromTextArea
      );
    }
    if (
      copyChosenUsers.find(
        (user) => userFullName(user) === userFullName(filteredUsers[i])
      )
    ) {
      alert('This user has already been selected!');
      return 0;
    }
    setTextHTML(
      RichText.pasteContentBtwTags(
        userFullName(filteredUsers[i]),
        textHTML,
        cursorPos,
        END_TAG_AT,
        1
      )
    );
    const hadSelectedUsers = [
      ...chosenUsersWithoutNemo,
      { ...filteredUsers[i] },
    ];
    setCopyChosenUsers(hadSelectedUsers);
    setChosenUsers(hadSelectedUsers);
    setIsDropdownList(false);
    RichText.incrementPositionCursor(
      userFullName(filteredUsers[i]).length - cursorPos.focusOffset + 1,
      cursorPos,
      textHTML,
      setCaret
    );
    const listChosenUsers = RichText.filtrationById(
      hadSelectedUsers,
      listAllUsers
    );
    setIndexOfSelection(0);
    setSearchString('');
    setIndexOfSelection(0);
    setCursorPosition(cursorPos);
    setFilteredUsers(listChosenUsers);
    if (!listChosenUsers.length) {
      return 0;
    }
    setCurrentSelection(listChosenUsers[0].id);
  };
  const clickHandling = (event) => {
    const element = textAreaRef.current;
    const cursor = Cursor.getCurrentCursorPosition(element);
    if (
      element.textContent.includes(
        `Use "@"  to include Shoutouts to members of the team!`
      )
    ) {
      setIsNotActive(true);
      Cursor.setCurrentCursorPosition(0, element);
      return;
    }
    if (
      cursor.isSPAN &&
      cursor.focusOffset - 1 !== cursor.focusNode.textContent.length
    ) {
      filteredUsers.map((user, index) => {
        if (userFullName(user) === cursor.focusNode.textContent.slice(1)) {
          setCurrentSelection(user.id);
          setIndexOfSelection(index);
        }
      });
      textHTML[cursor.realPos] !== '<'
        ? setIsDropdownList(true)
        : setIsDropdownList(false);
      setCoordinates(cursor.coordinates);
      setCaret(cursor.charCount);
    } else {
      setIsDropdownList(false);
    }
  };

  const submitHandling = () => {
    onSubmit({
      richText: textHTML,
      chosenUsers: copyChosenUsers,
      isPublic: isChecked,
    });
  };

  useEffect(() => {
    window.addEventListener('paste', function (e) {
      e.preventDefault();
      paste();
    });
    window.addEventListener('cut', function (e) {
      e.preventDefault();
    });
  }, [textHTML]);

  const pasteFromClipboard = (text) => {
    const cursorPos = Cursor.getCurrentCursorPosition(element);
    if (cursorPos.isDIV) {
      if (text.length + textAreaRef.current.innerText.length >= LIMIT_CHARS)
        return;
      RichText.pasteSymbolsToHTMLobj(
        text,
        textHTML,
        cursorPos,
        setTextHTML,
        setCaret
      );
      setCaret(caret + text.length);
    }
  };

  const copyToClipboard = (inputValue) => {
    if (inputValue) {
      navigator.clipboard
        .writeText(inputValue)
        .then(() => {})
        .catch((err) => {
          console.log('Something went wrong', err);
        });
    }
  };

  const paste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        pasteFromClipboard(text);
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <RichTextArea
          textHTML={textHTML}
          refs={textAreaRef}
          onKeyDown={handleKeyDown}
          onClick={clickHandling}
          cursorPos={Cursor.getCurrentCursorPosition(element)}
          className="c3 place-size-shout-out w-100 border-none text-start d-inline-block lh-sm pt-2"
          placeholder={`\x0DUse "${TAG_AT}${END_TAG_AT}"  to include Shoutouts to members of the team!\x0A`}
        />
        <div className='d-flex flex-column gap-3 justify-content-between flex-lg-row w-100'>
          <SwitcherShoutouts
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
          <Button
            className={`btn-modal bg-primary hover:bg-primary-hover c2 fs-3 p-0 ${
              isDisabled ? 'disabled' : ''
            }`}
            onClick={submitHandling}
          >
            Send Shoutout
          </Button>
        </div>
      </div>
      {isDropdownList &&
        filteredUsers.length &&
        indexOfSelection !== undefined && (
          <DropDownList
            dataList={filteredUsers}
            coordX={coordinates.x + OFFSET_X}
            coordY={coordinates.y + OFFSET_Y}
            onClick={clickEnterTabHandling}
            valSel={currentSelection}
            changeIndexSel={(val) => {
              setIndexOfSelection(val);
            }}
            changeValSel={(val) => {
              setCurrentSelection(val);
            }}
          />
        )}
    </>
  );
};

export default RichInputElement;
