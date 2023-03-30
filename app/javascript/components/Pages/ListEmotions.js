import React, { Fragment } from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import { NavLink, useNavigate} from 'react-router-dom'
import QuestionButton from "../UI/QuestionButton";
import Menu from "../UI/Menu";
import ShoutoutButton from "../UI/ShoutoutButton";
import BtnAddYourOwnWord from "../UI/BtnAddYourOwnWord";

//*** Below what we have in the data. See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***        data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {steps: "[\"ListEmotions\"]", word:""}},
//***               current_user_id: ...,
//***               time_period:{...}
function ListEmotions({ data,  setData , saveDataToDb, steps, service}) {
  const {isLoading, error} = service
  const emotions = data.data
  const timePeriod = data.time_period
  const navigate = useNavigate()
  const clickHandling = (emotion_word, emotion_id, timePeriod_id, category) => {
    steps.push('meme-selection')
    const dataRequest = {
        emotion_id: emotion_id,
        time_period_id: data.time_period.id,
        user_id: data.current_user_id,
      }
    saveDataToDb( steps, dataRequest )
  }

  const ownWordHandling = () =>{
    steps.push('emotion-entry')
    const dataRequest = {
      time_period_id: data.time_period.id,
      user_id: data.current_user_id,
    }
    saveDataToDb( steps, dataRequest )
  }

  const onClickNotWorking = () => {
    steps.push('results')
    const dataRequest = {
      emotion_id: '',
      not_working: true,
      time_period_id: data.time_period.id,
      user_id: data.current_user_id,
    }
    saveDataToDb( steps, dataRequest )
  }

  const rangeFormat = (tp) => {
    let start_date = new Date(tp.start_date)
    let end_date = new Date(tp.end_date)
    let month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
    return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
  }

  //*** **transformation of table** to the view:
  //*** 6+6(positive columns) 6+6(neutral columns) and 6+6(negative columns)
  const mixUp = (index) => ( index - 6 * (Math.ceil( index / 6 ) - 1 )) * 6 - (Math.ceil ( index / 6 ) - 1 ) - 1

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
        <div className="board  mt-35">
          <div className="convert bigger ml-41">
            <p>Logo/Brand</p>
            <div className="line1 offset-line1"></div>
            <div className="line2 offset-line2"></div>
          </div>
          <div className="h-40">
             <div className="calendar ml-240 mt-37">
               <div className="data mx-auto my-0 ">
                 21 Jan
               </div>
             </div>
          </div>
          <div className="invitation mx-auto p-0">Time for this week's check-in!</div>
          <div className="mx-auto my-0 question">Which word best describes how you felt at work this week?</div>
              <div className='emotions d-flex'>
                {emotions.map((emotion, index) =>
                   <ButtonEmotion key={emotion.id}
                                  category={emotions[mixUp(index+1)].attributes.category}
                                  onClick={() =>
                                    clickHandling(
                                      emotions[mixUp(index+1)].attributes.word,
                                      emotions[mixUp(index+1)].id,
                                      timePeriod.id
                                  )}>{emotions[mixUp(index+1)].attributes.word}
                     
                   </ButtonEmotion>
                )}
              </div>
          <div className="big-btn-tooltip">Share it in your own words!</div>
          <div className="big-btn">
          <BtnAddYourOwnWord className="link-text" content="Add your own word" onClick={ownWordHandling}/>
          </div>
          <NavLink className="lnk-was-not  mx-auto my-0 " onClick={onClickNotWorking} to={''}>
            I was not working this week
          </NavLink>
          <QuestionButton />
          <ShoutoutButton />
          <Menu >X% complete</Menu>
        </div>
      }
    </Fragment>
  );
}

export default ListEmotions;