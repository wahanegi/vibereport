import React, {Fragment, useState, useEffect} from 'react';
import {backHandling, isPresent} from "../helpers/helpers";
import {Wrapper, BtnBack, Header, ShoutOutIcon, HelpIcon, BtnPrimary} from "../UI/ShareContent";
import {apiRequest, createQuestion, removeQuestion, updateQuestion} from "../requests/axios_requests";
import axios from "axios";

const IcebreakerQuestion = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [prevStateQuestion, setPrevStateQuestion] = useState( {})
  const [funQuestion, setFunQuestion] = useState( {})
  const user_name = data.current_user.first_name
  console.log('funQuestion', funQuestion)
  console.log('prevStateQuestion', prevStateQuestion)
  // const handlingOnClickNext = () => {
  //   if(question.question_body) {
  //     if (question.question_body !== prevStateQuestion?.question_body && isPresent(prevStateQuestion?.question_body)) {
  //       steps.push('emotion-intensity')
  //       updateQuestion(question, data, setQuestion, setData, steps).then(saveDataToDb(steps, {fun_question_id: question.id}))
  //     } else if(question.question_body === prevStateQuestion?.question_body) {
  //       steps.push('emotion-entry')
  //       saveDataToDb(steps, {})
  //     } else {
  //       steps.push('causes-to-celebrate')
  //       createQuestion(data.current_user.id, response_id, question, setQuestion, data, setData).then(saveDataToDb(steps, {fun_question_id: question.id}))
  //     }
  //   } else{
  //     if (isPresent(prevStateQuestion)) {
  //       steps.push('emotion-entry')
  //       removeQuestion(question.id, data, setQuestion, setData).then(saveDataToDb(steps))
  //     }
  //   }
  // }

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question) =>{
      steps.push('meme-selection')
      saveDataToDb( steps, {fun_question_id: fun_question.data.id} )
    }
    const dataRequest = {
      fun_question: funQuestion
    }
    apiRequest("POST", dataRequest, dataFromServer, ()=>{}, "/api/v1/fun_questions").then();
  };

  const onChangQuestion = (e) => {
    setFunQuestion(Object.assign({}, funQuestion, {[e.target.name]: e.target.value}))
  }

  useEffect(() => {
    const id = data.response.attributes.fun_question_id
    axios.get(`/api/v1/fun_questions/${id}`)
      .then(res => {
        setPrevStateQuestion(res.data.data?.attributes)
        setFunQuestion(res.data.data?.attributes)
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
            <h4 className='mb-0'>Thanks for answering!</h4>
            <h1 className='mb-3'>Interested in submitting your <br/> own question to the team?</h1>
          </div>
          <div className='icebreaker'>
            <div className='wrap'>
              <p className='b3 muted'><span className='color-rose'>@</span>{user_name} asks:</p>
              <form>
                <div className="form-group">
                  <textarea className='input' name='question_body'
                    placeholder='What would you ask the team? You could be selected!'
                    value={funQuestion?.question_body || ''}
                    onChange={onChangQuestion} maxLength={700} />
                </div>
              </form>
            </div>
          </div>
          <div className='d-flex justify-content-between m-3'>
            <ShoutOutIcon/>
            <BtnBack addClass='btn-question' onClick={backHandling}/>
            <BtnPrimary onClick={handlingOnClickNext} text={funQuestion?.question_body ? 'Submit' : 'Skip to Results'} />
            <HelpIcon/>
          </div>
        </Wrapper>
      }
    </Fragment>
  );
};

export default IcebreakerQuestion;
