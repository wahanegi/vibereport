import React from 'react';
import Button from "./Button";

const BtnAddYourOwnWord = (props) => {
    return (
      <div className='own_word'>
        <Button className={props.className} onClick={props.onClick}>
          {props.content}
        </Button>
      </div>
    );
};

export default BtnAddYourOwnWord;