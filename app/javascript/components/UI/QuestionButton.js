import React from 'react';
import {NavLink} from "react-router-dom";
import QuestionMark from '../../../assets/svg/question.svg'

const QuestionButton = () => {
  return (
    <NavLink style={{position: 'fixed', right: 47, top: 756 }} to="mailto: support@vibereport.app">
      <img  src={QuestionMark} alt="Question" />
    </NavLink>
  );
};

export default QuestionButton;