import React, {Fragment, useState, useEffect} from 'react';
import {isBlank, isEmptyStr, isNotEmptyStr, isPresent} from "../helpers/helpers";
import {apiRequest} from "../requests/axios_requests";
import axios from "axios";
import CornerElements from "../UI/CornerElements";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import {MAX_CHAR_LIMIT} from "../helpers/consts";

const IcebreakerQuestion = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [prevStateQuestion, setPrevStateQuestion] = useState({})
  const [funQuestion, setFunQuestion] = useState( {})
  const prevQuestionBody = prevStateQuestion?.question_body
  const funQuestionBody = funQuestion?.question_body
  const userName = data.current_user.first_name
  const [isDraft, setIsDraft] = useState(draft)

  const dataRequest = {
    fun_question: {
      question_body: funQuestionBody,
      user_id: data.current_user.id
    }
  }

  useEffect(() => {
    if (funQuestionBody !== prevQuestionBody && isDraft) {
      setIsDraft(false);
    }
  }, [funQuestionBody]);

  const handleSaveDraft = () => {
    const dataFromServer = (fun_question) =>{
      saveDataToDb( steps, {fun_question_id: fun_question.data.id})
    }
    const dataDraft = {dataRequest, draft: true};
    saveDataToDb(steps, dataDraft)
    setIsDraft(true)
    saveDataQuestion(()=>{}, dataFromServer);
  }

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question) =>{
      steps.push('results')
      saveDataToDb( steps, {fun_question_id: fun_question.data.id, draft: true})
    }
    const goToResultPage = () => {
      steps.push('results')
      saveDataToDb(steps)
    }
    saveDataQuestion(goToResultPage, dataFromServer);
  };

  const saveDataQuestion = (goToResultPage, dataFromServer) =>{
    const url = '/api/v1/fun_questions/'
    const id = prevStateQuestion?.id
    if(isPresent(prevQuestionBody)) {
      if(prevQuestionBody !== funQuestionBody && isNotEmptyStr(funQuestionBody)) {
        apiRequest("PATCH", dataRequest, dataFromServer, ()=>{}, `${url}${id}`).then();
      } else if(isEmptyStr(funQuestionBody)) {
        apiRequest("DELETE", () => {}, () => {}, () => {}, `${url}${id}`).then(goToResultPage);
      } else {
        goToResultPage()
      }
    } else if (isEmptyStr(funQuestionBody)) {
      goToResultPage()
    } else {
      apiRequest("POST", dataRequest, dataFromServer, ()=>{}, `${url}`).then();
    }
  }

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
                                onChange={onChangQuestion} maxLength={MAX_CHAR_LIMIT} />
                      </div>
                    </form>
                  </div>
                }
              </div>
            </div>
          </div>
      }
      <BlockLowerBtns isSubmit={true} handlingOnClickNext={handlingOnClickNext} stringBody={funQuestionBody}/>
      <CornerElements         data = { data }
                              setData = { setData }
                              saveDataToDb={saveDataToDb}
                              steps={steps}
                              draft={isDraft}
                              handleSaveDraft={handleSaveDraft}/>
    </Fragment>
  );
};

export default IcebreakerQuestion;
