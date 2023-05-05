import React, {useEffect, useState} from "react";
import {DEFAULT_USER_NAME, MIN_USERS_RESPONSES} from "../../helpers/consts";
import {isBlank} from "../../helpers/helpers";
import Collapse from 'react-bootstrap/Collapse';
import polygon_answer from "../../../../assets/images/polygon-answer.svg";
import expand_icon from "../../../../assets/images/expand-icon.svg";
import collapse_icon from "../../../../assets/images/collapse.svg";

const PreviewQuestionSection = () =>
  <div className='results col'>
    <div className='row wrap question preview mb-3' />
  </div>

const AnswerItem = ({answer, user, collapse}) => {
  const [isCollapse, setIsCollapse] = useState(collapse);
  const toggle = () => {
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    setIsCollapse(collapse);
  }, [collapse]);

  return <div className='row wrap question answer mb-1'>
    <div className="col-10">
      <div className='h5 w-auto text-start truncated'>
        <span className='color-rose'>@</span>{user.first_name} said: {`${isCollapse ? '"' + answer.answer_body + '"' : '' }`}
      </div>
    </div>
    <div className="col-2">
      <div className='d-flex justify-content-end align-items-center pointer' onClick={toggle}>
        <span className='me-1 mb-0 muted h6'>{isCollapse ? 'See more ' : 'See less '}</span>
        <img src={polygon_answer} alt="answer" className={`${isCollapse ? '' : 'rotate'}`} />
      </div>
    </div>
    <Collapse in={!isCollapse}>
      <div className={`h5 text-start`}>{`"${answer.answer_body}"`}</div>
    </Collapse>
  </div>
}

const QuestionSection = ({fun_question, answers, isCurrentTimePeriod}) => {
  if(isCurrentTimePeriod && answers.length < MIN_USERS_RESPONSES) return <PreviewQuestionSection />

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
    <div className='row wrap question mb-1'>
      <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asked:</p><br/>
      <h5 className='w-auto text-start'> {fun_question.question_body}</h5>
      <div className='text-end pointer' onClick={collapseAll}>
        <img src={collapse ? expand_icon : collapse_icon} alt="expand all" className='expand-icon' />
        <a className='ms-1 text-black h6'>{title}</a>
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
