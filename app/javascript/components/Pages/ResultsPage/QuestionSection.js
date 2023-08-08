import React, {Fragment, useEffect, useState, useRef} from "react";
import {isBlank} from "../../helpers/helpers";

const PreviewQuestionSection = () =>
  <div className='results col'>
    <div className='row wrap question preview mb-3' />
  </div>

const EmptyQuestionSection = ({nextTimePeriod, userName, fun_question, steps,
                               saveDataToDb, setShowWorkingModal}) => {
  const [text, setText] = useState('');
  const [addClass, setAddClass] = useState('')
  const handleMouseEnter = () => {
    !nextTimePeriod && setText('Answer this Icebreaker!');
    !nextTimePeriod && setAddClass('hover-event')
  };

  const handleMouseLeave = () => {
    setText(nextTimePeriod ? 'No responses this time...' : 'No responses yet...');
    setAddClass('');
  };

  const handlingBack = () => {
    const index = steps.indexOf('icebreaker-answer');
    if (index === -1) {
      !nextTimePeriod && setShowWorkingModal(true)
    } else {
      const new_steps = steps.slice(0, index + 1);
      !nextTimePeriod && saveDataToDb( new_steps )
    }
  }

  useEffect(() => {
    setText(nextTimePeriod ? 'No responses this time...' : 'No responses yet...');
  }, [fun_question])

  return <Fragment>
    <div className='results col'>
      <Question {...{userName, fun_question}} />
    </div>
    <div className={`results col ${nextTimePeriod ? '': 'pointer'}`} onClick={handlingBack}>
      <div className={`empty-answer ${addClass} row wrap question mb-3`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <h5 className='d-flex justify-content-center fw-semibold'>{text}</h5>
      </div>
    </div>
  </Fragment>
}

const Question = ({userName, fun_question}) => {
  if (isBlank(fun_question)) return null;

  return <div className='row wrap question mb-1'>
    {
      userName && <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asked:<br/></p>
    }
    <h5 className='w-auto text-start fw-semibold'> {fun_question.question_body}</h5>
  </div>
}

const AnswerItem = ({answer, user}) => {
  return <div className='row wrap question answer mb-1'>
    <div className="col-xl-12">
      <div className='h5 w-auto text-start fw-semibold'>
        <span className='color-rose'>@</span>{user.first_name} said: {answer.answer_body}
      </div>
    </div>
  </div>
}

const QuestionSection = ({fun_question, answers, nextTimePeriod, steps, saveDataToDb, isMinUsersResponses, setShowWorkingModal}) => {
  if(!nextTimePeriod && isMinUsersResponses) return <PreviewQuestionSection />

  const userName = fun_question?.user?.first_name

  if(isBlank(answers)) return <EmptyQuestionSection userName={userName}
                                                    fun_question={fun_question}
                                                    nextTimePeriod={nextTimePeriod}
                                                    steps={steps}
                                                    saveDataToDb={saveDataToDb}
                                                    setShowWorkingModal={setShowWorkingModal}/>

  return <div className='results col'>
    <Question {...{userName, fun_question}} />
    {
      answers.map(data => {
        const {answer, user} = data
        return <AnswerItem key={answer.id} {...{answer, user}} />
      })
    }
  </div>
}

export default QuestionSection
