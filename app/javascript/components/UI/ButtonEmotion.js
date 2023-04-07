import React, {useState} from 'react';
import {specialProp} from "../helpers/library";

const ButtonEmotion = (props) => {
  const word = props.children
  const expandableCss = { minWidth: specialProp(word, 'width' ), margin: specialProp(word, 'margin') }

  const clickHandling = () =>{
    props.onClick()
  }

  return (
      <button type='button'
            className={`wb1 ${props.category}`}
            style={expandableCss}
            onClick={clickHandling}>
        {props.children}
      </button>
  );
};

export default ButtonEmotion;