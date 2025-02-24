import React, {useState} from 'react';

const ButtonEmotion = (props) => {

  const clickHandling = () =>{
    props.onClick()
  }

  return (
      <button type='button' className={`btn btn-bubbles wb1 fw-bold ${props.category}`} onClick={clickHandling}>
        {props.children}
      </button>
  );
};

export default ButtonEmotion;