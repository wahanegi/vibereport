import React, {useEffect, useState} from "react";
import {DEFAULT_USER_NAME} from "../../helpers/consts";
import {isBlank} from "../../helpers/helpers";
import Collapse from 'react-bootstrap/Collapse';
import polygon_answer from "../../../../assets/images/polygon-answer.svg";
import expand_icon from "../../../../assets/images/expand-icon.svg";
import collapse_icon from "../../../../assets/images/collapse.png";

const AnswerItem = ({answer, user, collapse}) => {
  const [isCollapse, setIsCollapse] = useState(collapse);
  const toggle = () => {
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    setIsCollapse(collapse);
  }, [collapse]);

  return <div className='row wrap answer mb-1'>
    <div className="row g-0">
      <div className="col-10">
        <p className='h5 w-auto text-start truncated'>
          <span className='color-rose'>@</span>{user.first_name} said: {`${isCollapse ? '"' + answer.answer_body + '"' : '' }`}
        </p>
      </div>
      <div className="col-2">
        <div className='text-end'>
          <span className='ms-1 muted h6'>{isCollapse ? 'See more ' : 'See less '}</span>
          <img src={polygon_answer} alt="answer"
               className={`${isCollapse ? '' : 'rotate'}`}
               onClick={toggle} />
        </div>
      </div>
    </div>
    <Collapse in={!isCollapse}>
      <p className={`h5 text-start`}>{`"${answer.answer_body}"`}</p>
    </Collapse>
  </div>
}

const QuestionSection = ({fun_question, answers}) => {
  if (isBlank(fun_question) || isBlank(answers)) return null

  const userName = fun_question.user?.first_name || DEFAULT_USER_NAME
  const [collapse, setCollapse] = useState(true);
  const [title, setTitle] = useState("Expand all");
  const collapseAll = () => {
    setCollapse(!collapse);
    setTitle(prev => {
      return prev === "Expand all" ? "Collapse all" : "Expand all";
    });
  };

  const Question = () =>
    <div className='row wrap mb-1'>
      <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asked:</p><br/>
      <h5 className='w-auto text-start'> {fun_question.question_body}</h5>
      <div className='text-end' onClick={collapseAll}>
        <img src={collapse ? expand_icon : collapse_icon} alt="expand all" className='expand-icon' />
        <a className='ms-1 text-black'>{title}</a>
      </div>
    </div>

  return <div className='results col'>
    <Question />
    {
      answers.map(data => {
        const {answer, user} = data
        return <AnswerItem key={answer.id} {...{answer, user, collapse}} />
      })
    }
  </div>
}

export default QuestionSection
