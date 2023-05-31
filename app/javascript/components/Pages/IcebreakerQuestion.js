import React, {Fragment, useState, useEffect} from 'react';
import {backHandling, isBlank, isEmptyStr, isNotEmptyStr, isPresent} from "../helpers/helpers";
import {BtnBack, BtnPrimary} from "../UI/ShareContent";
import {apiRequest} from "../requests/axios_requests";
import axios from "axios";
import CornerElements from "../UI/CornerElements";

const IcebreakerQuestion = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [prevStateQuestion, setPrevStateQuestion] = useState({})
  const [funQuestion, setFunQuestion] = useState( {})
  const prevQuestionBody = prevStateQuestion?.question_body
  const funQuestionBody = funQuestion?.question_body
  const userName = data.current_user.first_name

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question) =>{
      // TODO: change to redirect to the results page when it appears
      steps.push('icebreaker-answer')
      saveDataToDb( steps, {fun_question_id: fun_question.data.id})
    }
    const dataRequest = {
      fun_question: {
        question_body: funQuestionBody,
        user_id: data.current_user.id
      }
    }
    const goToResultPage = () => {
      // TODO: change to redirect to the results page when it appears
      steps.push('icebreaker-answer')
      saveDataToDb(steps)
    }
    const url = '/api/v1/fun_questions/'
    const id = prevStateQuestion?.id
    if(isPresent(prevQuestionBody)) {
      if(prevQuestionBody !== funQuestionBody && isNotEmptyStr(funQuestionBody)) {
        apiRequest("PATCH", dataRequest, dataFromServer, ()=>{}, `${url}${id}`).then();
      } else if(isEmptyStr(funQuestionBody)) {
        apiRequest("DESTROY", () => {}, () => {}, () => {}, `${url}${id}`).then(goToResultPage);
      } else {
        goToResultPage()
      }
    } else if (isEmptyStr(funQuestionBody)) {
      goToResultPage()
    } else {
      apiRequest("POST", dataRequest, dataFromServer, ()=>{}, `${url}`).then();
    }
  };

  const onChangQuestion = (e) => {
    setFunQuestion(Object.assign({}, funQuestion, {[e.target.name]: e.target.value}))
  }

  useEffect(() => {
    const fun_question_id = data.response.attributes.fun_question_id
    isBlank(fun_question_id) && setLoaded(true)
    fun_question_id && axios.get(`/api/v1/fun_questions/${fun_question_id}`)
      .then(res => {
        setPrevStateQuestion(res.data.data?.attributes)
        setFunQuestion(res.data.data?.attributes)
        setLoaded(true)
      })
  }, [])

  if (!!error) return <p>{error.message}</p>

  return (
    <Fragment>
      {!isLoading && !error &&
          <div className='icebreaker-position'>
            <div className='d-flex justify-content-center flex-column'>
              <h4 className='mb-0'>Thanks for answering!</h4>
              <h1 className='mb-3'>Interested in submitting your <br/> own question to the team?</h1>
            </div>
            <div className='icebreaker'>
              <div className='wrap'>
                <p className='b3 muted'><span className='red-violet'>@</span>{userName} asks:</p>
                {loaded &&
                  <div className='wrap-textarea middle'>
                    <form>
                      <div className="form-group">
                      <textarea className='input middle' name='question_body'
                                placeholder='What would you ask the team? You could be selected!'
                                value={funQuestion?.question_body || ''}
                                onChange={onChangQuestion} maxLength={700} />
                      </div>
                    </form>
                  </div>
                }
              </div>
            </div>
            <div className='d-flex placement-buttons justify-content-between col-6 offset-3 pb-52 mt-5'>
              <BtnBack onClick={backHandling}/>
              <BtnPrimary addClass={`${isEmptyStr(funQuestionBody) ? "answer-custom" : ""}`}
                          onClick={handlingOnClickNext}
                          text={isEmptyStr(funQuestionBody) ? 'Skip to Results' : 'Submit'} />
            </div>
          </div>
      }
      <CornerElements         data = { data }
                              setData = { setData }
                              percentCompletion = {0}/>
    </Fragment>
  );
};

export default IcebreakerQuestion;
