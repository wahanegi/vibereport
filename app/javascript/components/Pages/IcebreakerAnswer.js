import React, {Fragment, useState, useEffect} from 'react';
import {backHandling} from "../helpers/helpers";
import {Wrapper, BtnBack, Header, ShoutOutIcon, HelpIcon, BtnPrimary} from "../UI/ShareContent";
import {createAnswer, updateAnswer} from "../requests/axios_requests";

const IcebreakerAnswer = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [answerBody, setAnswerBody] = useState( data.answer_fun_question?.answer_body || '')
  const {user_name, question_body, question_id} = data.fun_question
  const response_id = data.response.id
  const user = user_name || 'Admin'
  const current_user_id = data.current_user_id
console.log(answerBody)

  // const handlingOnClickNext = () => {
  //   if(answerBody){
  //     steps.push('emotion-intensity')
  //     createAnswer(question_id, response_id, current_user_id, answerBody, setAnswerBody).then(saveDataToDb( steps, {}))
  //   }else{
  //     steps.push('emotion-entry')
  //     saveDataToDb( steps, {})
  //   }
  // }
  const handlingOnClickNext = () => {
    if(!answerBody){
      steps.push('emotion-entry')
      saveDataToDb( steps, {})
    }else if(answerBody !== data.answer_fun_question?.answer_body){
      steps.push('emotion-intensity')
      updateAnswer(answerBody, setAnswerBody).then(saveDataToDb( steps, {}))
    }else{
      steps.push('emotion-intensity')
      createAnswer(question_id, response_id, current_user_id, answerBody, setAnswerBody).then(saveDataToDb( steps, {}))
    }
  }

  console.log(!data.answer_fun_question)
  if (!!error) return <p>{error.message}</p>
  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      {!isLoading && !error &&
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
                  <textarea
                    className="input"
                    placeholder="Tell us what you think!"
                    value={answerBody}
                    onChange={(e) => {
                      setAnswerBody(e.target.value)
                    }}
                    maxLength={700}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className='d-flex justify-content-between m-3'>
            <ShoutOutIcon/>
            <BtnBack addClass='btn-question' onClick={backHandling}/>
            <BtnPrimary onClick={handlingOnClickNext} text={answerBody ? 'Submit' : 'Skip to Results'} />
            <HelpIcon/>
          </div>
        </Wrapper>
      }
    </Fragment>
  );
};

export default IcebreakerAnswer;
