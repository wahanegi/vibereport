import React, {Fragment, useState, useEffect} from 'react';
import {backHandling} from "../helpers/helpers";
import {Wrapper, BtnBack, Header, ShoutOutIcon, HelpIcon} from "../UI/ShareContent";

const Icebreaker = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [answer, setAnswer] = useState( '')
  // const [questions, setQuestions] = useState([])
  const handlingOnClickNext = () => {
    if(answer){
      steps.push('emotion-intensity')
      saveDataToDb( steps, { })
    }else{
      steps.push('emotion-entry')
      saveDataToDb( steps, { })
    }
  }
  //
  // useEffect(() =>{
  //   axios.get('/api/v1/all_fun_questions')
  //     .then(res => {
  //       setQuestions(res.data.data)
  //     })
  // }, [])

  const BtnNextQuestion = ({ hidden, onClick }) =>
    <button onClick={onClick} className={`btn btn-regular btn-question`} hidden={hidden}>
      {answer ? 'Submit' : 'Skip to Results'}
    </button>

  console.log("value:", answer)
  if (!!error) return <p>{error.message}</p>
  console.log("data", data)
  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      {!isLoading && !error &&
        <Wrapper>
          <Header/>
          <div className='d-flex justify-content-center flex-column'>
            <h1 className='mb-0'>Kick back, relax.</h1>
            <h1 className='mb-3'>Time for question of the week!</h1>
            <h2 className='icebreaker'>Brought to us by <span
              style={{color: '#E02AA4'}}>@</span>{data.fun_question ? `${data.fun_question.user_id}` : 'Admin'}</h2>
          </div>
          <div className='wrap-question'>
            <p className='b3 tag-name'><span
              style={{color: '#E02AA4'}}>@</span>{data.fun_question ? `${data.fun_question.user_id}` : 'Admin'} asks:
            </p>
            <p className='text-question'>Which would you rather fight? A Danny Devito-sized dachsund, or 5
              dachsund-sized Danny DeVitos?</p>
            <form>
              <div className="form-group">
            <textarea
              className="input-answer"
              placeholder="Tell us what you think!"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value)
              }}
              maxLength={700}
            />
              </div>
            </form>
          </div>
          <div className='d-flex justify-content-between m-3'>
            <ShoutOutIcon/>
            <BtnBack addClass='btn-question' onClick={backHandling}/>
            <BtnNextQuestion onClick={handlingOnClickNext}/>
            <HelpIcon/>
          </div>
        </Wrapper>
      }
    </Fragment>
  );
};

export default Icebreaker;