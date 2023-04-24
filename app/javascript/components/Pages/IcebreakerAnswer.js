import React, {Fragment, useState, useEffect} from 'react';
import {backHandling, isPresent} from "../helpers/helpers";
import {Wrapper, BtnBack, Header, ShoutOutIcon, HelpIcon, BtnPrimary} from "../UI/ShareContent";
import {apiRequest} from "../requests/axios_requests";
import axios from "axios";

const IcebreakerAnswer = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [prevStateAnswer, setPrevStateAnswer] = useState( {})
  const [answerFunQuestion, setAnswerFunQuestion] = useState( {})
  const [answerBody, setAnswerBody] = useState( data.answer_fun_question?.answer_body || '')
  const {user_name, question_body} = data.fun_question
  const user = user_name || 'Admin'
  const current_user_id = data.current_user.id

  console.log('data', data)
  // const handlingOnClickNext = () => {
  //   if(!answerFunQuestion.answer_body){
  //     steps.push('emotion-entry')
  //     saveDataToDb( steps, {})
  //   } else if(answerFunQuestion.answer_body !== prevStateAnswer?.answer_body && isPresent(prevStateAnswer?.answer_body)){
  //     steps.push('meme-selection')
  //     updateAnswer(answerBody, setAnswerBody).then(saveDataToDb( steps, {}))
  //   }else{
  //     steps.push('emotion-intensity')
  //     createAnswer(question_id, response_id, current_user_id, answerBody, setAnswerBody).then(saveDataToDb( steps,
  //       {answer_fun_question_id: answerFunQuestion.data.id}
  //     ))
  //   }
  // }

  const handlingOnClickNext = () => {
    const dataFromServer = (answer_fun_question) =>{
      steps.push('icebreaker-question')
      saveDataToDb( steps, {answer_fun_question_id: answer_fun_question.data.id} )
    }
    const dataRequest = {
      answer_fun_question: {
        answer_body: answerFunQuestion.answer_body,
        user_id: current_user_id,
        fun_question_id: data.fun_question.id
      }
    }
    if(prevStateAnswer.answer_body !== answerFunQuestion.answer_body && answerFunQuestion.answer_body !== '' && isPresent(prevStateAnswer.answer_body)){
      const id = prevStateAnswer.id
      apiRequest("PATCH", dataRequest, dataFromServer, ()=>{}, `/api/v1/answer_fun_questions/${id}`).then();
    }else if(isPresent(prevStateAnswer.answer_body) && answerFunQuestion.answer_body === ''){
      const id = prevStateAnswer.id
      apiRequest("DESTROY", dataRequest, dataFromServer, ()=>{}, `/api/v1/answer_fun_questions/${id}`).then();
    }else{
      apiRequest("POST", dataRequest, dataFromServer, ()=>{}, "/api/v1/answer_fun_questions").then();
    }
  };

  const onChangAnswer = (e) => {
    setAnswerFunQuestion(Object.assign({}, answerFunQuestion, {[e.target.name]: e.target.value}))
  }

  useEffect(() => {
    const id = data.response.attributes.answer_fun_question_id
    axios.get(`/api/v1/answer_fun_questions/${id}`)
      .then(res => {
        setPrevStateAnswer(res.data.data?.attributes)
        setAnswerFunQuestion(res.data.data?.attributes)
        setLoaded(true)
      })
  }, [])

  if (!!error) return <p>{error.message}</p>

  return (
    <Fragment>
      {loaded && !isLoading && !error &&
        <Wrapper>
          <Header/>
          <div className='d-flex justify-content-center flex-column'>
            <h1 className='mb-0'>Kick back, relax.</h1>
            <h1 className='mb-3'>Time for question of the week!</h1>
            <h2 className='color-black'>Brought to us by <span className='color-rose'>@</span>{user}</h2>
          </div>
          <div className='icebreaker'>
            <div className='wrap'>
              <p className='b3 muted'><span className='color-rose'>@</span>{user} asks:</p>
              <h5>{question_body}</h5>
              <form>
                <div className="form-group">
                  <textarea className="input" name='answer_body'
                            placeholder="Tell us what you think!"
                            value={answerFunQuestion?.answer_body || ''}
                            onChange={onChangAnswer}
                            maxLength={700}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className='d-flex justify-content-between m-3'>
            <ShoutOutIcon/>
            <BtnBack addClass='btn-question' onClick={backHandling}/>
            <BtnPrimary onClick={handlingOnClickNext} text={answerFunQuestion?.answer_body ? 'Submit' : 'Skip to Results'} />
            <HelpIcon/>
          </div>
        </Wrapper>
      }
    </Fragment>
  );
};

export default IcebreakerAnswer;
