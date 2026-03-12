import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';

const RichTextArea = ({
  textHTML,
  refs,
  onKeyDown,
  onClick,
  className,
  cursorPos,
  placeholder,
  children,
  onInput,
}) => {
  const [isNotActive, setIsNotActive] = useState(true);
  useEffect(() => {
    const rect = refs.current.getBoundingClientRect();
    const isCaretWithinBounds =
      rect.top < cursorPos.coordinates.y &&
      rect.bottom > cursorPos.coordinates.y;
    if (process.env.NODE_ENV !== 'test' && !isCaretWithinBounds) {
      refs.current.scrollBy({ top: cursorPos.coordinates.y - rect.y });
    }
  }, [cursorPos]);

  const handleOnKeyUp = (e) => {
    !textHTML.length ? setIsNotActive(true) : setIsNotActive(false);
  };
  const handleOnClick = () => {
    onClick();
    setIsNotActive(false);
  };

  const onContextMenuHandling = (e) => {
    setIsNotActive(false);
  };

  const isPlaceholder = !textHTML.length;

  return (
    <div className={` ${className} overflow-hidden`}>
      <div
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onKeyUp={handleOnKeyUp}
        onClick={handleOnClick}
        onContextMenu={onContextMenuHandling}
        ref={refs}
        data-testid="editable-div"
        id="textArea"
        className={`form-control text-start fs-5 fs-md-4 inner-div position-relative scrolling fw-bold ${
          isPlaceholder && 'gray-300'
        }`}
      >
        {parse(isPlaceholder ? placeholder : textHTML + '\x0A')}
      </div>
      {children}
    </div>
  );
};

export default RichTextArea;
