import React from 'react';
import {NavLink} from "react-router-dom";
import help_icon from "../../../assets/images/help.svg"

const QuestionButton = () => {
  return (
    <NavLink style={{position: 'absolute', right: 47, top: 756 }} to="mailto: support@vibereport.app">
      <img  src={QuestionMark} alt="Question" />

    </NavLink>
  );
};

export default QuestionButton;