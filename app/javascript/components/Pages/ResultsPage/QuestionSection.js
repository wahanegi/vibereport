import React, {Fragment, useEffect, useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";
import {isBlank, isEmptyStr, isNotEmptyStr, isPresent} from "../../helpers/helpers";
import {apiRequest, updateResponse} from "../../requests/axios_requests";
import EmojiRow from "./Emojis/EmojiRow";

const PreviewQuestionSection = () =>
  <div className='results container blur-effect'>
    <div className='row wrap question preview mw-100'/>
  </div>

const EmptyQuestionSection = ({
                                nextTimePeriod, userName, fun_question,
                                setShowWorkingModal, data, setData
                              }) => {
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
    if (isPresent(data.prev_results_path)) return;

    const steps = data.response.attributes.steps
    const index = steps.indexOf('icebreaker-answer');
    if (index === -1) {
      !nextTimePeriod && setShowWorkingModal(true)
    } else {
      const new_steps = steps.slice(0, index + 1);
      const dataRequest = {
        response: {attributes: {steps: new_steps}}
      }
      !nextTimePeriod && updateResponse(data, setData, dataRequest)
    }
  }

  useEffect(() => {
    setText(nextTimePeriod ? 'No responses this time...' : 'No responses yet...');
  }, [fun_question])

  return <Fragment>
    <div className='results container'>
      <Question {...{userName, fun_question}} />
    </div>
    <div className={`results container ${nextTimePeriod ? '' : 'pointer'}`} onClick={handlingBack}>
      <div className={`empty-answer ${addClass} row wrap question mb-3 mw-100`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <h5 className='d-flex justify-content-center fw-semibold'>{text}</h5>
      </div>
    </div>
  </Fragment>
}

const Question = ({userName, fun_question}) => {
  if (isBlank(fun_question)) return null;

  return <div className='row wrap question mb-1 mw-100'>
    {
      userName && <p className='b3 muted text-start fs-7'><span className='color-rose'>@</span>{userName} asks:<br/></p>
    }
    <h6 className='fs-7 fs-xxl-6 fs-xl-6 fs-lg-6 fs-md-6 fs-sm-7 w-auto text-start fw-semibold'> {fun_question.question_body}</h6>
  </div>
}

const AnswerItem = ({
                      answer,
                      emojis,
                      user,
                      current_user,
                      nextTimePeriod,
                      fun_question,
                      answersArray,
                      setAnswersArray
                    }) => {
  const isCurrentUser = !nextTimePeriod && current_user.email === user.email
  const [edit, setEdit] = useState(false)
  const [answerBody, setAnswerBody] = useState(answer.answer_body || '')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedEmojiName, setSelectedEmojiName] = useState("");
  const [emojisArr, setEmojisArr] = useState(emojis || []);
  const modalRef = useRef(null);
  const [emojiObject, setEmojiObject] = useState({});
  const onCancel = () => {
    setEdit(false)
    setAnswerBody(answer.answer_body)
  }

  const dataRequest = {
    fun_question_answer: {
      answer_body: answerBody || '',
      fun_question_id: fun_question.id
    }
  }

  useEffect(() => {
    if (selectedEmoji) {
      setShowEmojiPicker(false)
      setEmojiObject(Object.assign({}, emojiObject, {
          emoji_code: selectedEmoji,
          emoji_name: selectedEmojiName,
          emojiable_id: answer.id,
          emojiable_type: 'FunQuestionAnswer'
        })
      )
    }
  }, [selectedEmoji])

  useEffect(() => {
    setEmojisArr(emojis)
  }, [emojis])

  const dataFromServer = (fun_question_answer) => {
    const updatedAnswerBody = fun_question_answer.data.attributes.answer_body
    const updatedData = answersArray.map(item => {
      if (item.answer.id === answer.id) {
        const updatedAnswer = Object.assign({}, item.answer, {
          answer_body: updatedAnswerBody,
        });
        return {...item, answer: updatedAnswer};
      }
      return item;
    });
    setAnswersArray(updatedData)
    setEdit(false)
  }
  const updateAnswersArray = (callback) => {
    if (callback.message === 'success') {
      const newAnswersArray = answersArray.filter(item => item.answer.id !== answer.id)
      setAnswersArray(newAnswersArray)
    }
    setEdit(false)
  }

  const updateAnswer = () => {
    const url = '/api/v1/fun_question_answers/'
    const id = answer.id
    if (answer.answer_body !== answerBody && isNotEmptyStr(answerBody)) {
      apiRequest("PATCH", dataRequest, dataFromServer, () => {
      }, `${url}${id}`).then();
    } else if (isEmptyStr(answerBody)) {
      apiRequest("DELETE", () => {
      }, updateAnswersArray, () => {
      }, `${url}${id}`).then();
    } else {
      setEdit(false)
    }
  }

  return <div className='row wrap question answer mb-1 mw-100'>
    <div className="col-xl-12">
      <div className='d-flex justify-content-end'>
        {isCurrentUser && !edit &&
          <Link to={''} className='text-muted h6 fw-semibold mb-0' onClick={() => setEdit(true)}>Edit</Link>}
      </div>
      {edit && <div className='d-flex justify-content-end'>
        <Link to={''} className='text-danger h6 fw-semibold me-2' onClick={onCancel}>Cancel</Link>
        <Link to={''} className='color-green h6 fw-semibold' disabled onClick={updateAnswer}>Save</Link>
      </div>}
      <div className='edit-question fs-6 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-5 fs-sm-6 w-auto text-start fw-semibold'>
        <span className='color-rose'>@</span>{user.first_name} said:&nbsp;
        {
          edit ?
            <Form.Control as="textarea" rows={4}
                          size="lg"
                          autoFocus={true}
                          onChange={e => setAnswerBody(e.target.value)}
                          value={answerBody}/> :
            answer.answer_body
        }
      </div>
      <EmojiRow {...{
        emojiObject, setSelectedEmoji, setSelectedEmojiName, emojisArr, setEmojisArr, current_user,
        setEmojiObject, showEmojiPicker, setShowEmojiPicker, modalRef
      }} />
    </div>
  </div>
}

const QuestionSection = ({
                           fun_question, answers, nextTimePeriod, isMinUsersResponses,
                           setShowWorkingModal, current_user, data, setData
                         }) => {
  if (!nextTimePeriod && isMinUsersResponses) return <PreviewQuestionSection/>

  const userName = fun_question?.user?.first_name
  const [answersArray, setAnswersArray] = useState(answers || [])

  useEffect(() => {
    setAnswersArray(answers)
  }, [answers])

  if (isBlank(answersArray)) return <EmptyQuestionSection userName={userName}
                                                          fun_question={fun_question}
                                                          nextTimePeriod={nextTimePeriod}
                                                          data={data}
                                                          setData={setData}
                                                          setShowWorkingModal={setShowWorkingModal}/>

  return <div className='results container'>
    <Question {...{userName, fun_question}} />
    {
      answersArray.map(data => {
        const {answer, user, emojis} = data
        return <AnswerItem key={answer.id} {...{
          answer, emojis, fun_question, user, current_user, nextTimePeriod,
          answersArray, setAnswersArray
        }} />
      })
    }
  </div>
}

export default QuestionSection
