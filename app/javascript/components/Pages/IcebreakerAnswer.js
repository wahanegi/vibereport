import React, {Fragment, useState, useEffect} from 'react';
import {backHandling, isEmptyStr, isNotEmptyStr, isPresent} from "../helpers/helpers";
import {Wrapper, BtnBack, Header, ShoutOutIcon, HelpIcon, BtnPrimary} from "../UI/ShareContent";
import {apiRequest} from "../requests/axios_requests";
import axios from "axios";

const IcebreakerAnswer = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [prevStateAnswer, setPrevStateAnswer] = useState( {})
  const [answerFunQuestion, setAnswerFunQuestion] = useState( {})
  const prevAnswerBody = prevStateAnswer?.answer_body
  const answerBody = answerFunQuestion?.answer_body
  const {user_name, question_body} = data.fun_question
  const user = user_name
  const current_user_id = data.current_user.id

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question_answer) =>{
      steps.push('icebreaker-question')
      saveDataToDb( steps, {fun_question_answer_id: fun_question_answer.data.id} )
    }
    const dataRequest = {
      fun_question_answer: {
        answer_body: answerBody,
        user_id: current_user_id,
        fun_question_id: data.fun_question.id
      }
    }
    const goToResultPage = () => {
      steps.push('productivity-bad-follow-up')
      saveDataToDb(steps)
    }
    const url = '/api/v1/fun_question_answers/'
    const id = prevStateAnswer?.id

    if(isPresent(prevAnswerBody)) {
      if(prevAnswerBody !== answerBody && isNotEmptyStr(answerBody)) {
        apiRequest("PATCH", dataRequest, dataFromServer, ()=>{}, `${url}${id}`).then();
      } else if(isEmptyStr(answerBody)) {
        apiRequest("DESTROY", () => {}, () => {}, () => {}, `${url}${id}`).then(goToResultPage);
      } else {
        steps.push('icebreaker-question')
        saveDataToDb(steps)
      }
    } else if (isEmptyStr(answerBody)) {
      steps.push('productivity-bad-follow-up')
      saveDataToDb(steps)
    } else {
      apiRequest("POST", dataRequest, dataFromServer, ()=>{}, `${url}`).then();
    }
  };

  const onChangAnswer = (e) => {
    setAnswerFunQuestion(Object.assign({}, answerFunQuestion, {[e.target.name]: e.target.value}))
  }

  useEffect(() => {
    const id = data.response.attributes.fun_question_answer_id
    axios.get(`/api/v1/fun_question_answers/${id}`)
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
          <div className='icebreaker-position'>
            <div className='justify-content-beetwen flex-column' style={{height: '180px'}}>
              <h1 className='mb-0'>Kick back, relax.</h1>
              <h1 className='mb-3'>Time for a team question!</h1>
              {user && <h2 className='color-black mb-0'>Brought to us by <span className='red-violet'>@</span>{user}</h2>}
            </div>
            <div className='icebreaker'>
              <div className='wrap'>
                {user && <p className='b3 muted align-content-end'><span className='red-violet'>@</span>{user} asks:</p>}
                <h5 className='text-md-start'>{question_body}</h5>
                <form>
                  <div className="form-group">
                    <textarea className="input mb-0" name='answer_body'
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
              <BtnBack addClass="answer-custom" onClick={backHandling}/>
              <BtnPrimary addClass="answer-custom"  onClick={handlingOnClickNext} text={isEmptyStr(answerBody) ? 'Skip to Results' : 'Submit'} />
              <HelpIcon/>
            </div>
          </div>
        </Wrapper>
      }
    </Fragment>
  );
};

export default IcebreakerAnswer;