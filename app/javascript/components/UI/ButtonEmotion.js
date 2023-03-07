import React, {useState} from 'react';
import {special_prop} from "../helper_functions/library";

const ButtonEmotion = (props) => {
  const word = props.children
  const expandableCss = { width: special_prop(word, 'width' ), margin: special_prop(word, 'margin') }

  const clickHandling = () =>{
    props.onClick()
  }

  return (
      <button type='button'
            className={props.category}
            style={expandableCss}
            onClick={clickHandling}>
        {props.children}
      </button>
  );
};

export default ButtonEmotion;