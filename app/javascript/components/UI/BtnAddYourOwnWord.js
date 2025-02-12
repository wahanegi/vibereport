import React from 'react';
import {Link} from "react-router-dom";

const BtnAddYourOwnWord = (props) => {
    return (
      <div className="big-btn-text">
        <Link onClick={props.onClick}>{props.content}</Link>
      </div>
    );
};

export default BtnAddYourOwnWord;