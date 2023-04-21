import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ShoutoutModal from '../UI/ShoutoutModal';
import Cursor from "../helpers/library";

describe('ShoutoutModal', () => {
  const portalElement = document.createElement('div');
  portalElement.id = 'overlays'
  document.body.appendChild(portalElement);

  it('check what user input to the textarea', () => {
    const { getByTestId } = render( <ShoutoutModal /> );
    const editableDiv = getByTestId('editable-div');
    fireEvent.change(editableDiv, { target: { ref: '@Person1 thanks for help!' } });
    expect(editableDiv.ref).toBe('@Person1 thanks for help!');
  });
  // it('should be define position of cursor', () => {
  //   const { getByTestId } = render( <ShoutoutModal /> );
  //   const editableDiv = getByTestId('editable-div');
  //   fireEvent.change(editableDiv, { target: { ref: 'Hey Team. I want to say many thanks to the' } });
  //
  //   expect(editableDiv.ref).toBe('Hey Team. I want to say many thanks to the');
  //   Cursor.setCurrentCursorPosition(40,editableDiv)
  //   expect(Cursor.getCurrentCursorPosition(editableDiv.current).charCount).toBe(40)
  //   expect(editableDiv.ref.length).toBe(42);
  // });
  // expect(editableDiv.textContent).toBe('H');

  // fireEvent.keyDown(editableDiv, { key: 'H', code: 'KeyH' });
  //
  // fireEvent.keyDown(editableDiv, { key: 'e', code: 'KeyE' });

  // fireEvent.keyDown(editableDiv, { key: 'l', code: 'KeyL' });
  // fireEvent.keyDown(editableDiv, { key: 'l', code: 'KeyL' });
  // fireEvent.keyDown(editableDiv, { key: 'o', code: 'KeyO' });
  // do something after the delay
});