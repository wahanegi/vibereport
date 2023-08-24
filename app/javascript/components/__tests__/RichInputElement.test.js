import React from 'react';
  import { render, fireEvent , screen } from '@testing-library/react';
import RichInputElement from "../UI/rich-text/RichInputElement";
import Cursor from "../UI/rich-text/cursor";
import  RichText  from "../UI/rich-text/rich-text"

const listUsers = [
  { id: 1, first_name: 'George', last_name: 'Washington' },
  { id: 2, first_name: 'Jackie', last_name: 'Chan' },
  { id: 3, first_name: 'Janice', last_name: 'Wednesday'},
  { id: 4, first_name: 'Kara', last_name: 'Friday'},
  { id: 5, first_name: 'Kieran', last_name: 'Roomie'},
  { id: 6, first_name: 'Mike', last_name: 'Snider'},
  { id: 7, first_name: 'Marina', last_name: 'Harasko'},
  { id: 8, first_name: 'Vitalii', last_name: 'Shevchenko'},
  { id: 9, first_name: 'roger', last_name: ''}
  // other users...
]
const editObj = {
  id: 1,
  public: true
}

const setupRichInputElement = (richText, setChosenUsers) => {
  return render(
    <RichInputElement
      richText={richText}
      listUsers={listUsers}
      setChosenUsers={setChosenUsers}
      setRichText={() => {}}
      onSubmit={() => {}}
      editObj={editObj}
    />
  );
};

const nonAllowedChars =  [',', '@', '`', '<', '>', ';', ':', '/', '\\']
const highlightAT = '<span class="color-primary">@'

  describe('RichInputElement', ()=> {
    let setChosenUsersMock;

    beforeEach(() => {
      setChosenUsersMock = jest.fn();
      jest.clearAllMocks();
    });

    it('should input entire words "Hi Team!" and setup the cursor at the end of the string"', () => {
      const { getByTestId } = setupRichInputElement('Hi Team!');

      const divElement = getByTestId('editable-div');
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hi Team!\x0A');
      const cursorPos = Cursor.getCurrentCursorPosition(divElement)
      expect(cursorPos.charCount).toBe('Hi Team!'.length)
    })

    it('should input symbol "@" after, BTW and before non-space symbols', () => {
      const { getByTestId } = setupRichInputElement('Hi Team!');

      const divElement = getByTestId('editable-div');
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hi Team!@\x0A')
      Cursor.setCurrentCursorPosition(5, divElement)
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hi Te@am!@\x0A')
      Cursor.setCurrentCursorPosition(0, divElement)
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@Hi Te@am!@\x0A')
    })

    it('input entire rich words "@roger and @Mike say Hi Team!" and add symbols "s@" before "!"', () => {
      const richText = highlightAT + 'roger</span> and ' + highlightAT + 'Mike Snider</span> say Hi Team!'
      const { getByTestId } = setupRichInputElement(richText);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(35, divElement)
      const pos = Cursor.getCurrentCursorPosition(divElement)
      expect(pos.realPos).toBe(105)
      fireEvent.keyDown(divElement, {key: 's'});
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@roger and @Mike Snider say Hi Teams@!\x0A');
    })

    it('should change "@George Washington" on the "@s", delete him chosenUsers, open DropDownList', () => {
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[0]) + '</span> , ' +
          highlightAT + RichText.userFullName(listUsers[1]) + '</span> and ' +
          highlightAT + RichText.userFullName(listUsers[2]) + '</span> , thanks for non-stop renew))'
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 1, first_name: 'George', last_name: 'Washington'},
        {id: 2, first_name: 'Jackie', last_name: 'Chan'}, {id: 3, first_name: 'Janice', last_name: 'Wednesday'}])
      Cursor.setCurrentCursorPosition(5, divElement)
      const pos = Cursor.getCurrentCursorPosition(divElement)
      expect(pos.realPos).toBe(33)
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      fireEvent.keyDown(divElement, {key: 'ArrowRight'});
      fireEvent.keyDown(divElement, {key: 's'});
      expect(divElement.innerHTML).toContain(RichText.encodeSpace('Hey <span class=\"color-primary\">@s</span> , <span class=\"color-primary\">@'));
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 2, first_name: 'Jackie', last_name: 'Chan'},
        {id: 3, first_name: 'Janice', last_name: 'Wednesday'}])
      const listItems = screen.getAllByRole('listitem');
      const expectedUsers = [
        { id: 1, first_name: 'George', last_name: 'Washington'},
        { id: 4, first_name: 'Kara', last_name: 'Friday'},
        { id: 5, first_name: 'Kieran', last_name: 'Roomie'},
        { id: 7, first_name: 'Marina', last_name: 'Harasko'},
        { id: 6, first_name: 'Mike', last_name: 'Snider'},
        { id: 9, first_name: 'roger', last_name: ''},
        { id: 8, first_name: 'Vitalii', last_name: 'Shevchenko'}
      ]
      expect(listItems).toHaveLength(expectedUsers.length);
      listItems.forEach((listItem, index) => {
        expect(listItem.textContent).toBe(RichText.userFullName(expectedUsers[index]));
      });
    })

    it('should add space after char when cursor before @', () => {
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[0]) + '</span> and ' +
          highlightAT + RichText.userFullName(listUsers[1]) + '</span>, thanks for non-stop renew))'
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 1, first_name: 'George', last_name: 'Washington'},
        {id: 2, first_name: 'Jackie', last_name: 'Chan'}])
      Cursor.setCurrentCursorPosition(4, divElement)
      const pos = Cursor.getCurrentCursorPosition(divElement)
      expect(pos.realPos).toBe(4);
      const userName = 'guys '
      userName.split('').forEach(char => {
        fireEvent.keyDown(divElement, {key: char});
      })
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hey guys @George Washington and @Jackie Chan, thanks for non-stop renew))\x0A');
    })

    it('should change "@George Washington" on the "@Mike Snider" in the textarea and in the chosenUsers', () => {
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[0]) + '</span>, ' +
          highlightAT + RichText.userFullName(listUsers[1]) + '</span> and ' +
          highlightAT + RichText.userFullName(listUsers[2]) + '</span> , thanks for non-stop renew))'

      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 1, first_name: 'George', last_name: 'Washington'},
        {id: 2, first_name: 'Jackie', last_name: 'Chan'}, {id: 3, first_name: 'Janice', last_name: 'Wednesday'}])
      Cursor.setCurrentCursorPosition(5, divElement);
      fireEvent.keyDown(divElement, {key: 'm'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hey @m, @Jackie Chan and @Janice Wednesday , thanks for non-stop renew))\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 2, first_name: 'Jackie', last_name: 'Chan'},
        {id: 3, first_name: 'Janice', last_name: 'Wednesday'}]);
      ['i', 'k', 'e', ' ', 's', 'n', 'i', 'd', 'e', 'r'].forEach(char => {
        fireEvent.keyDown(divElement, {key: char});
      })
      expect(RichText.decodeSpace160(divElement.textContent)).toBe(
          'Hey @Mike Snider, @Jackie Chan and @Janice Wednesday , thanks for non-stop renew))\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 2, first_name: 'Jackie', last_name: 'Chan'},
        {id: 3, first_name: 'Janice', last_name: 'Wednesday'}, {id: 6, first_name: 'Mike', last_name: 'Snider'}])
      fireEvent.keyDown(divElement, {key: '!'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe(
          'Hey @Mike Snider!, @Jackie Chan and @Janice Wednesday , thanks for non-stop renew))\x0A');
    })

    it('should check the non allowed characters for user searches ', () => {
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[0]) + '</span> , thanks for non-stop renew))'
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div')
      Cursor.setCurrentCursorPosition(5, divElement)
      nonAllowedChars.forEach((char) => {
        fireEvent.keyDown(divElement, {key: char});
        expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hey @George Washington , thanks for non-stop renew))\x0A');
      });
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 1, first_name: 'George', last_name: 'Washington'}])
    })

    it('should make imitation input sentence  with names of users ', () => {
      const sentence = [".", "T", "H", "A", "N", "K", " ", "Y", "O", "U", " ", "@"]
      const continueSentence = ["r", "o", "g", "e", "r", " ", "!",]
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[0]) + '</span>, thanks for non-stop renew))'

      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div')
      Cursor.setCurrentCursorPosition(51, divElement)
      sentence.forEach((char) => {
        fireEvent.keyDown(divElement, {key: char});
      });
      expect(divElement.innerHTML).toContain('<span class="color-primary">@')
      continueSentence.forEach((char) => {
        fireEvent.keyDown(divElement, {key: char});
      });
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hey @George Washington, thanks for non-stop renew)).THANK YOU @roger !\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 1, first_name: 'George', last_name: 'Washington'},
        {id: 9, first_name: 'roger', last_name: ''}])
    })

    it('should add userName from DropDownList by press Enter or Space button', () => {
      const richText = 'Hey ' + highlightAT + RichText.userFullName(listUsers[2]) + '</span>, ' +
          highlightAT + RichText.userFullName(listUsers[1]) + '</span> and '

      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 3, first_name: 'Janice', last_name: 'Wednesday'},
        {id: 2, first_name: 'Jackie', last_name: 'Chan'}])
      Cursor.setCurrentCursorPosition(40, divElement)
      const pos = Cursor.getCurrentCursorPosition(divElement)
      expect(pos.realPos).toBe(110)
      fireEvent.keyDown(divElement, {key: '@'});
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(listUsers.length - 2);
      fireEvent.keyDown(divElement, {key: 'Tab'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hey @Janice Wednesday, @Jackie Chan and @George Washington\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 3, first_name: 'Janice', last_name: 'Wednesday'},
        {id: 2, first_name: 'Jackie', last_name: 'Chan'}, {id: 1, first_name: 'George', last_name: 'Washington'}])
    })

    it('should add four users from DropDownList by press Enter or Space button', () => {
      const richText = ''
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(0, divElement)
      fireEvent.keyDown(divElement, {key: '@'});
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(listUsers.length);
      listItems.forEach((listItem, index) => {
        expect(listItem.textContent).toBe(RichText.userFullName(listUsers[index]));
      });
      const pos = Cursor.getCurrentCursorPosition(divElement)
      expect(pos.realPos).toBe(29)

      fireEvent.keyDown(divElement, {key: 'Enter'});
      const listItems1 = screen.queryAllByRole('listitem');
      expect(listItems1.textContent).toBe(undefined);
      fireEvent.keyDown(divElement, {key: ','});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe("@George Washington,\x0A")
      fireEvent.keyDown(divElement, {keyCode: 32});
      fireEvent.keyDown(divElement, {key: '@'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe("@George Washington, @Jackie Chan\x0A")
      fireEvent.keyDown(divElement, {keyCode: 32});
      fireEvent.keyDown(divElement, {key: '@'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe("@George Washington, @Jackie Chan @Janice Wednesday\x0A")
      fireEvent.keyDown(divElement, {keyCode: 32});
      fireEvent.keyDown(divElement, {key: '@'});
      fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe("@George Washington, @Jackie Chan @Janice Wednesday @Kieran Roomie\x0A")
      fireEvent.keyDown(divElement, {keyCode: 32});
      fireEvent.keyDown(divElement, {key: '@'});
      fireEvent.keyDown(divElement, {key: 'ArrowUp'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@George Washington, @Jackie Chan @Janice Wednesday @Kieran Roomie @Vitalii Shevchenko\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith(
          [{id: 1, first_name: 'George', last_name: 'Washington'},
            {id: 2, first_name: 'Jackie', last_name: 'Chan'},
            {id: 3, first_name: 'Janice', last_name: 'Wednesday'},
            {id: 5, first_name: 'Kieran', last_name: 'Roomie'},
            {id: 8, first_name: 'Vitalii', last_name: 'Shevchenko'}
          ])
    })

    it('should open drop-down list when cursor move on the user position and' +
        ' change user from DropDownList by press Enter or Tab button', () => {
      const richText = '<span class="color-primary">@George Washington</span>, ' +
          '<span class="color-primary">@Jackie Chan</span> ' +
          '<span class="color-primary">@Janice Wednesday</span> ' +
          '<span class="color-primary">@Kieran Roomie</span> ' +
          '<span class="color-primary">@roger</span> '
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(52, divElement)
      fireEvent.click(divElement);
      // fireEvent.keyDown(divElement, { key: 'k' });
      fireEvent.keyDown(divElement, {key: 'ArrowUp'});
      fireEvent.keyDown(divElement, {key: 'ArrowUp'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@George Washington, @Jackie Chan @Janice Wednesday @Mike Snider @roger \x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith(
          [{id: 1, first_name: 'George', last_name: 'Washington'},
            {id: 2, first_name: 'Jackie', last_name: 'Chan'},
            {id: 3, first_name: 'Janice', last_name: 'Wednesday'},
            {id: 9, first_name: 'roger', last_name: ''},
            {id: 6, first_name: 'Mike', last_name: 'Snider'}
          ])
    })

    it('should open drop-down list when cursor move on the user position and' +
        ' sorting users by press button "k" from DropDownList and chose by press Enter or Space button', () => {
      const richText = '<span class="color-primary">@George Washington</span>, ' +
          '<span class="color-primary">@Jackie Chan</span> ' +
          '<span class="color-primary">@Janice Wednesday</span> ' +
          '<span class="color-primary">@Kieran Roomie</span> <span class="color-primary">@roger</span> '

      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(52, divElement)
      fireEvent.click(divElement);
      fireEvent.keyDown(divElement, {key: 'k'});
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(4);
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@George Washington, @Jackie Chan @Janice Wednesday @Kara Friday @roger \x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith(
          [{id: 1, first_name: 'George', last_name: 'Washington'},
            {id: 2, first_name: 'Jackie', last_name: 'Chan'},
            {id: 3, first_name: 'Janice', last_name: 'Wednesday'},
            {id: 9, first_name: 'roger', last_name: ''},
            {id: 4, first_name: 'Kara', last_name: 'Friday'}
          ])
    })

    it('should open drop-down list when cursor moved on the name user position and' +
        ' sorting users on the DropDownList by input "jan"  and non available  choosing ' +
        'this user by way press Enter or Space button, ' +
        'because user with name "Janice Wednesday" is have in the text', () => {
      const richText = '<span class="color-primary">@George Washington</span>, ' +
          '<span class="color-primary">@Jackie Chan</span> ' +
          '<span class="color-primary">@Janice Wednesday</span> ' +
          '<span class="color-primary">@Kieran Roomie</span> ' +
          '<span class="color-primary">@roger</span>'
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(52, divElement)
      fireEvent.click(divElement);
      fireEvent.keyDown(divElement, {key: 'j'});
      fireEvent.keyDown(divElement, {key: 'a'});
      fireEvent.keyDown(divElement, {key: 'n'});
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(4);
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@George Washington, @Jackie Chan @Janice Wednesday @Kara Friday @roger\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith(
          [{id: 1, first_name: 'George', last_name: 'Washington'},
            {id: 2, first_name: 'Jackie', last_name: 'Chan'},
            {id: 3, first_name: 'Janice', last_name: 'Wednesday'},
            {id: 9, first_name: 'roger', last_name: ''},
            { id: 4, first_name: 'Kara', last_name: 'Friday'}
          ])
    })

    it('should check correct work a special buttons of keyboard', () => {
      // const richText = '<span class="color-primary">@George Washington</span>, '
      const richText = "Hello world!"

      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      // mouse click
      Cursor.setCurrentCursorPosition(7, divElement)
      fireEvent.click(divElement);
      //Button Home
      fireEvent.keyDown(divElement, {key: 'Home'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(0)
      //Button End
      fireEvent.keyDown(divElement, {key: 'End'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(12)
      // Button BackSpace
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(11)
      // Button delete
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(10)
      fireEvent.keyDown(divElement, {key: 'Delete'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(10)
      fireEvent.keyDown(divElement, {key: 'd'});
      fireEvent.keyDown(divElement, {key: ' '});
      fireEvent.keyDown(divElement, {key: '@'});
      let listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(9);
      fireEvent.keyDown(divElement, {key: 'j'});
      fireEvent.keyDown(divElement, {key: 'a'});
      fireEvent.keyDown(divElement, {key: 'n'});
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('Hello world @Janice Wednesday\x0A');
      expect(setChosenUsersMock).toHaveBeenCalledWith([{id: 3, first_name: 'Janice', last_name: 'Wednesday'}])
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(28)
    })

    it('check correct work of button Backspace in different place of the text', () => {
      const richText = '<span class="color-primary">@George Washington</span>  say Hello world!'
      const { getByTestId } = setupRichInputElement(richText);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(7, divElement)
      fireEvent.click(divElement);
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('  say Hello world!\x0A')
      //delete &nbsp;
      Cursor.setCurrentCursorPosition(2, divElement)
      fireEvent.click(divElement);
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(2)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe(' say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(1)
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(1)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(0)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(0)
      fireEvent.keyDown(divElement, {key: '@'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(1)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(1)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: ' '});
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      fireEvent.keyDown(divElement, {key: '@'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(1)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(29)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(0)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(0)
      fireEvent.keyDown(divElement, {key: '@'});
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@ say Hello world!\x0A')
      let listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('\x0A@ say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('@ say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: 'Delete'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe(' say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: '1'});
      ;
      fireEvent.keyDown(divElement, {key: ' '});
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('1 @ say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      fireEvent.keyDown(divElement, {key: 'Delete'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('1  say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(2)
      fireEvent.keyDown(divElement, {key: '@'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      fireEvent.keyDown(divElement, {key: ' '});
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      fireEvent.keyDown(divElement, {key: ' '});
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      fireEvent.keyDown(divElement, {key: '@'});
      fireEvent.keyDown(divElement, {key: 'm'});
      fireEvent.keyDown(divElement, {key: 'Tab'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(36)
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('1 @George Washington @Marina Harasko  say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(21)
      expect(RichText.encodeSpace(divElement.textContent)).toBe('1 @George Washington   say Hello world!\x0A')
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('1 @George Washington  say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(20)
      fireEvent.keyDown(divElement, {key: 'Delete'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(2)
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('1   say Hello world!\x0A')
    })


    it('check correct work of button Delete in different place of the text', () => {
      const richText = '<span class="color-primary">@George Washington</span>  say Hello world!'

      const { getByTestId } = setupRichInputElement(richText);

      const divElement = getByTestId('editable-div');
      Cursor.setCurrentCursorPosition(0, divElement)
      fireEvent.click(divElement);
      fireEvent.keyDown(divElement, {key: 'Delete'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('  say Hello world!\x0A')
      //delete &nbsp;
      Cursor.setCurrentCursorPosition(2, divElement)
      fireEvent.click(divElement);
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(2)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe(' say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(1)
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(1)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe('say Hello world!\x0A')
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(0)
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(0)

    })

    it('check function encodeHtml', () => {
      const html = '@John Washington</span>,    and    all. <span class="color-primary">@Jackie Chan</span> and '
      expect(html).toBe(RichText.decodeSpace160('@John Washington</span>,    and    all. ' +
          '<span class=\"color-primary\">@Jackie Chan</span> and '))
    })

    it('check decodeHtml function', () => {
      const html = '@John Washington</span>,    and    all. ' +
          '<span class=\"color-primary\">@Jackie Chan</span> and '
      const decodeHtml = RichText.decodeSpace160(html)
      expect(decodeHtml).toBe('@John Washington</span>,    and    all. <span class="color-primary">@Jackie Chan</span> and ')

    })

    it('should cancel hightlight text', () => {
      const richText = "Hey <span class=\"color-primary\">@George Washington</span>   . How do you do? " +
          '<span class="color-primary">@Jackie Chan</span> ' +
          '<span class="color-primary">@Janice Wednesday</span> ' +
          '<span class="color-primary">@Kieran Roomie</span> +' +
          '<span class="color-primary">@roger</span> !'

      const { getByTestId } = setupRichInputElement(richText);

      const divElement = getByTestId('editable-div');
      // mouse click
      Cursor.setCurrentCursorPosition(7, divElement)
      fireEvent.click(divElement);
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(4);
      const filteredUsers = [
        {id: 4, first_name: 'Kara', last_name: 'Friday'},
        { id: 7, first_name: 'Marina', last_name: 'Harasko'},
        { id: 6, first_name: 'Mike', last_name: 'Snider'},
        { id: 8, first_name: 'Vitalii', last_name: 'Shevchenko'},
      ]
      listItems.forEach((listItem, index) => {
        expect(listItem.textContent).toContain(RichText.userFullName(filteredUsers[index]));
      });
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey @George Washington   . How do you do? ')))
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(4)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(4)
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey    . How do you do? ')))
      fireEvent.keyDown(divElement, {key: '@'});
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey @   . How do you do? ')))
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(5)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(33)
      fireEvent.keyDown(divElement, {key: 'Escape'});
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey @   . How do you do? ')))
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(5)
      expect(Cursor.getCurrentCursorPosition(divElement).realPos).toBe(5)
    })

    it('should open dropdown list and chose other user by any position of text cursor', ()=>{
      const richText = "Hey <span class=\"color-primary\">@George Washington</span>   . How do you do? " +
          '<span class="color-primary">@Jackie Chan</span> ' +
          '<span class="color-primary">@Janice Wednesday</span> ' +
          '<span class="color-primary">@Kieran Roomie</span> <span class="color-primary">@roger</span> !'

      const { getByTestId } = setupRichInputElement(richText);

      const divElement = getByTestId('editable-div');
      // mouse click
      Cursor.setCurrentCursorPosition(7,divElement )
      fireEvent.click( divElement );
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(4);
      fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(7)
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey @Marina Harasko   . How do you do? ')))
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(19)
  })

    it('should allow to edit user in the string and change them in the chosenUser', ()=>{
      const richText = "Hey "
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      fireEvent.keyDown(divElement, {key: '@'});
      let listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(9);
      fireEvent.keyDown(divElement, {key: 'j'});
      fireEvent.keyDown(divElement, {key: 'a'});
      fireEvent.keyDown(divElement, {key: 'n'});
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe((('Hey @ja\x0A')))
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toBe((('Hey @Jackie Chan\x0A')))
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(16)
      expect(setChosenUsersMock).toHaveBeenCalledWith([ { id: 2, first_name: 'Jackie', last_name: 'Chan' }, ])
      fireEvent.keyDown(divElement, {key: 'ArrowLeft'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      // fireEvent.keyDown(divElement, {key: 'ArrowDown'});
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(RichText.decodeSpace160(divElement.textContent)).toContain((('Hey @George Washington')))
      expect(setChosenUsersMock).toHaveBeenCalledWith([ { id: 1, first_name: 'George', last_name: 'Washington' } ])
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(22)
      Cursor.setCurrentCursorPosition( 4,divElement)
      fireEvent.keyDown(divElement, {key: 'Delete'});//in real no delete-???
      expect(setChosenUsersMock.mock.calls[8][0]).toEqual(  [])
      fireEvent.keyDown(divElement, {key: '@'})
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(5)
      fireEvent.keyDown(divElement, {key: 'Enter'});
      expect(setChosenUsersMock.mock.calls[9]).toHaveLength( 1)
      expect(setChosenUsersMock.mock.calls[9][0]).toEqual(  [{"first_name": "George", "id": 1, "last_name": "Washington"}])
      fireEvent.keyDown(divElement, {key: 'Backspace'})
      expect(setChosenUsersMock.mock.calls[10][0]).toHaveLength( 0)
      expect(Cursor.getCurrentCursorPosition(divElement).charCount).toBe(4)
      listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      fireEvent.keyDown(divElement, {key: '@'})
      fireEvent.keyDown(divElement, {key: 'Enter'});
      Cursor.setCurrentCursorPosition( 8,divElement)
      fireEvent.click(divElement)
      fireEvent.keyDown(divElement, {key: 'j'})
      expect(RichText.decodeSpace160(divElement.textContent)).toBe((('Hey @George Washington\x0A')))
    })

    it('should allow to choose all users from dropdown list', ()=> {
      const richText = "Hey "
      const { getByTestId } = setupRichInputElement(richText, setChosenUsersMock);

      const divElement = getByTestId('editable-div');
      listUsers.forEach((listItem, index) => {
        fireEvent.keyDown(divElement, {key: ' '});
        fireEvent.keyDown(divElement, {key: '@'});
        fireEvent.keyDown(divElement, {key: 'Enter'});
      });
      expect(setChosenUsersMock.mock.calls).toHaveLength( 9)
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      fireEvent.keyDown(divElement, {key: 'Backspace'});
      expect(setChosenUsersMock.mock.calls[9][0]).toHaveLength( 8)
      fireEvent.keyDown(divElement, {key: '@'});
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(2);

    })
  })


