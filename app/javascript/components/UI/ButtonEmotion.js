import React from 'react';

const ButtonEmotion = (props) => {

  const clickHandling = () => {
    props.onClick()
  }

  return (
    <button type='button' className={`btn btn-bubbles wb1 fw-bold fs-sm-8 ${props.category}`} onClick={clickHandling}>
      {props.children}
    </button>
  );
};

export default ButtonEmotion;