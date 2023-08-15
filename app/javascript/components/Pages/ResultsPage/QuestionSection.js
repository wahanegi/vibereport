import React, {Fragment, useEffect, useState} from "react";
import {isBlank, isEmptyStr, isNotEmptyStr} from "../../helpers/helpers";
import isEmpty from "ramda/src/isEmpty";
import Form from "react-bootstrap/Form";
import {apiRequest} from "../../requests/axios_requests";
import {Link} from "react-router-dom";

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
      userName && <p className='b3 muted text-start'><span className='color-rose'>@</span>{userName} asks:<br/></p>
    }
    <h5 className='w-auto text-start fw-semibold'> {fun_question.question_body}</h5>
  </div>
}

const AnswerItem = ({answer, user, current_user, nextTimePeriod, fun_question, answersArray, setAnswersArray}) => {
  const isCurrentUser = !nextTimePeriod && current_user.email === user.email
  const [edit, setEdit] = useState(false)
  const [answerBody, setAnswerBody] = useState(answer.answer_body || '')

  const onCancel = () => {
    setEdit(false)
    setAnswerBody(answer.answer_body)
  }

  const dataRequest = {
    fun_question_answer: {
      answer_body: answerBody  || '',
      fun_question_id: fun_question.id
    }
  }

  const dataFromServer = (fun_question_answer) => {
    const updatedAnswerBody = fun_question_answer.data.attributes.answer_body
    const updatedData = answersArray.map(item => {
      if (item.answer.id === answer.id) {
        const updatedAnswer = Object.assign({}, item.answer, {
          answer_body: updatedAnswerBody,
        });
        return { ...item, answer: updatedAnswer };
      }
      return item;
    });
    setAnswersArray(updatedData)
    setEdit(false)
  }
  const updateAnswersArray = (callback) =>{
    if (callback.message === 'success') {
      const newAnswersArray = answersArray.filter(item => item.answer.id !== answer.id)
      setAnswersArray(newAnswersArray)
    }
    setEdit(false)
  }

  const updateAnswer = () => {
    const url = '/api/v1/fun_question_answers/'
    const id = answer.id
    if(answer.answer_body !== answerBody && isNotEmptyStr(answerBody)) {
      apiRequest("PATCH", dataRequest, dataFromServer, ()=>{}, `${url}${id}`).then();
    } else if(isEmptyStr(answerBody)) {
      apiRequest("DELETE", () => {}, updateAnswersArray, () => {}, `${url}${id}`).then();
    } else {
      setEdit(false)
    }
  }

  return <div className='row wrap question answer mb-1'>
    <div className="col-xl-12">
      <div className='edit-question h5 w-auto text-start fw-semibold'>
        <span className='color-rose'>@</span>{user.first_name} said:&nbsp;
        {
          edit ?
            <Form.Control as="textarea" rows={4}
                          size="lg"
                          autoFocus={true}
                          onChange={e => setAnswerBody(e.target.value)}
                          value={answerBody} />:
            answer.answer_body
        }
      </div>
      <div className='d-flex justify-content-end'>
        {isCurrentUser && !edit && <Link to={''} className='text-muted h6 fw-semibold' onClick={()=>setEdit(true)}>Edit</Link>}
      </div>
      {edit && <div className='d-flex justify-content-end'>
        <Link to={''} className='text-danger h6 fw-semibold me-2' onClick={onCancel}>Cancel</Link>
        <Link to={''} className='color-green h6 fw-semibold' disabled onClick={updateAnswer}>Save</Link>
      </div>}
    </div>
  </div>
}

const QuestionSection = ({fun_question, answers, nextTimePeriod, steps, saveDataToDb, isMinUsersResponses,
                           setShowWorkingModal, current_user}) => {
  if(!nextTimePeriod && isMinUsersResponses) return <PreviewQuestionSection />

  const userName = fun_question?.user?.first_name
  const [answersArray, setAnswersArray] = useState(answers || [])

  useEffect(() => {
    setAnswersArray(answers)
  }, [answers])

  if(isBlank(answersArray)) return <EmptyQuestionSection userName={userName}
                                                    fun_question={fun_question}
                                                    nextTimePeriod={nextTimePeriod}
                                                    steps={steps}
                                                    saveDataToDb={saveDataToDb}
                                                    setShowWorkingModal={setShowWorkingModal}/>

  return <div className='results col'>
    <Question {...{userName, fun_question}} />
    {
      answersArray.map(data => {
        const {answer, user} = data
        return <AnswerItem key={answer.id} {...{answer, fun_question, user, current_user, nextTimePeriod,
                                                answersArray, setAnswersArray}} />
      })
    }
  </div>
}

export default QuestionSection
