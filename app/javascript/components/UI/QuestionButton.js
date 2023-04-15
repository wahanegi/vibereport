import React from 'react';
import {NavLink} from "react-router-dom";
import questionMark from "../../../assets/images/help.svg"

const QuestionButton = () => {
  return (
    <NavLink className='placement-question-btn help-icon' to="mailto: support@vibereport.app">
      <img  src={questionMark} alt="Question" />
    </NavLink>
  );
};

export default QuestionButton;