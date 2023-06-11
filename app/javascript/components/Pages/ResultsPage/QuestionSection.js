import React, {Fragment, useEffect, useState} from "react";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import {isBlank} from "../../helpers/helpers";
import Collapse from 'react-bootstrap/Collapse';
import polygon_answer from "../../../../assets/images/polygon-answer.svg";
import expand_icon from "../../../../assets/images/expand-icon.svg";
import expand_icon_gray from "../../../../assets/images/expand-icon-gray.svg";
import collapse_icon from "../../../../assets/images/collapse.svg";

const PreviewQuestionSection = () =>
  <div className='results col'>
    <div className='row wrap question preview mb-3' />
  </div>

const EmptyQuestionSection = ({nextTimePeriod, userName, fun_question, collapse, setCollapse, steps, saveDataToDb}) => {
  const [text, setText] = useState(nextTimePeriod ? 'No responses this time...' : 'No responses yet..');
  const [addClass, setAddClass] = useState('')
  const handleMouseEnter = () => {
    !nextTimePeriod && setText('Answer this Icebreaker!');
    !nextTimePeriod && setAddClass('hover-event')
  };

  const handleMouseLeave = () => {
    setText(nextTimePeriod ? 'No responses this time...' : 'No responses yet..');
    setAddClass('');
  };

  const handlingBack = () => {
    const index = steps.indexOf('icebreaker-answer');
    const new_steps = steps.slice(0, index + 1);
    !nextTimePeriod && saveDataToDb( new_steps )
  }

  return <Fragment>
    <div className='results col'>
      <Question {...{userName, fun_question, collapse, setCollapse}} disabledCollapse={true} />
    </div>
    <div className={`results col ${nextTimePeriod ? '': 'pointer'}`} onClick={handlingBack}>
      <div className={`empty-answer ${addClass} row wrap question mb-3`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <h5 className='d-flex justify-content-center fw-semibold'>{text}</h5>
      </div>
    </div>
  </Fragment>
}

const Question = ({userName, fun_question, collapse, setCollapse, disabledCollapse = false}) => {
  if (isBlank(fun_question)) return null;

  const [title, setTitle] = useState("Expand all")
  const collapseAll = () => {
    if (disabledCollapse) return null;

    setCollapse(!collapse);
    setTitle(prev => {
      return prev === "Expand all" ? "Collapse all" : "Expand all";
    });
  };
  return <div className='row wrap question mb-1'>
    {
      userName && <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asked:<br/></p>
    }
    <h5 className='w-auto text-start fw-semibold'> {fun_question.question_body}</h5>
    <div className={`text-end ${disabledCollapse ? 'text-muted' : 'pointer'}`} onClick={collapseAll}>
      <img src={collapse ? disabledCollapse ? expand_icon_gray : expand_icon : collapse_icon} alt="expand all" className='expand-icon' />
      <a className={`ms-1 h6 ${disabledCollapse ? 'text-muted' : 'text-black'}`}>{title}</a>
    </div>
  </div>
}

const AnswerItem = ({answer, user, collapse}) => {
  const [isCollapse, setIsCollapse] = useState(collapse);
  const toggle = () => {
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    setIsCollapse(collapse);
  }, [collapse]);

  return <div className='row wrap question answer mb-1'>
    <div className="col-9">
      <div className='h5 w-auto text-start truncated fw-semibold'>
        <span className='color-rose'>@</span>{user.first_name} said: {isCollapse && answer.answer_body}
      </div>
    </div>
    <div className="col-3">
      <div className='d-flex flex-nowrap justify-content-end align-items-center pointer' onClick={toggle}>
        <span className='me-1 mb-0 muted h6'>{isCollapse ? 'See more ' : 'See less '}</span>
        <img src={polygon_answer} alt="answer" className={isCollapse ? '' : 'rotate'} />
      </div>
    </div>
    <Collapse in={!isCollapse}>
      <div className='h5 text-start fw-semibold'>{answer.answer_body}</div>
    </Collapse>
  </div>
}

const QuestionSection = ({fun_question, answers, nextTimePeriod, steps, saveDataToDb}) => {
  if(!nextTimePeriod && answers?.length < MIN_USERS_RESPONSES) return <PreviewQuestionSection />

  const userName = fun_question?.user?.first_name
  const [collapse, setCollapse] = useState(true);
  if(isBlank(answers)) return <EmptyQuestionSection userName={userName}
                                                    fun_question={fun_question}
                                                    collapse={collapse}
                                                    setCollapse={setCollapse}
                                                    nextTimePeriod={nextTimePeriod}
                                                    steps={steps}
                                                    saveDataToDb={saveDataToDb} />

  return <div className='results col'>
    <Question {...{userName, fun_question, collapse, setCollapse}} />
    {
      answers.map(data => {
        const {answer, user} = data
        return <AnswerItem key={answer.id} {...{answer, user, collapse}} />
      })
    }
  </div>
}

export default QuestionSection
