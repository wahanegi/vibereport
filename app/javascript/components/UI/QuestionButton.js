import React from 'react';
import {NavLink} from "react-router-dom";
import help_icon from "../../../assets/images/help.svg"

const QuestionButton = () => {
  return (
    <NavLink className='placement-question-btn help-icon' to="mailto: support@vibereport.app">
      <img  src={help_icon} alt="Question" />
    </NavLink>
  );
};

export default QuestionButton;