import React, {useState} from "react";
import {DEFAULT_USER_NAME} from "../../helpers/consts";
import {isBlank} from "../../helpers/helpers";
import Collapse from 'react-bootstrap/Collapse';
import polygon_answer from "../../../../assets/images/polygon-answer.svg";
import expand_icon from "../../../../assets/images/expand-icon.svg";

const AnswerItem = ({answer, user, navState, handleCollapseClick}) =>
  <div className='row wrap answer mb-1'>
    <div className="row g-0">
      <div className="col-10">
        <p className='h5 w-auto text-start truncated'>
          <span className='color-rose'>@</span>{user.first_name} said: {`${navState[answer.id] ? '' : '"' + answer.answer_body + '"'}`}
        </p>
      </div>
      <div className="col-2">
        <div className='text-end'>
          <span className='ms-1 muted'>{navState[answer.id] ? 'See less ' : 'See more '}</span>
          <img src={polygon_answer} alt="answer"
               className={`${navState[answer.id] ? 'rotate' : ''}`}
               onClick={() => handleCollapseClick(answer.id)}
               aria-controls={`collapse-${answer.id}`} />
        </div>
      </div>
    </div>
    <Collapse in={navState[answer.id]}>
      <p className={`h5 text-start`}>{`"${answer.answer_body}"`}</p>
    </Collapse>
  </div>

const QuestionSection = ({fun_question, answers}) => {
  if (isBlank(fun_question)) return null

  const userName = fun_question.user?.first_name || DEFAULT_USER_NAME
  const initialState = answers.reduce((a, v) => ({ ...a, [v.answer.id]: false }), {});
  const [navState, setNavState] = useState(initialState);
  const handleCollapseClick = (navId) =>
    setNavState((prev) => {
      return { ...prev, [navId]: !prev[navId] };
    });
  const handleExpandAll = () => setNavState(answers.reduce((a, v) => ({ ...a, [v.answer.id]: true }), {}))

  const Question = () =>
    <div className='row wrap mb-1 position-relative'>
      <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asked:</p><br/>
      <h5 className='w-auto text-start'> {fun_question.question_body}</h5>
      <div className='text-end' onClick={handleExpandAll}>
        <img src={expand_icon} alt="expand all" style={{width: 26.6, height: 26, padding: 0}} />
        <span className='ms-1 muted'>Expand all</span>
      </div>
    </div>

  return <div className='results col'>
    <Question />
    {
      answers.map(data => {
        const {answer, user} = data
        return <AnswerItem key={answer.id} {...{answer, user, navState, handleCollapseClick}} />
      })
    }
  </div>
}

export default QuestionSection
