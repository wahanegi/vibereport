import React, { Fragment } from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import { NavLink } from 'react-router-dom'
import QuestionButton from "../UI/QuestionButton";
import Menu from "../UI/Menu";
import ShoutoutButton from "../UI/ShoutoutButton";
import BtnAddYourOwnWord from "../UI/BtnAddYourOwnWord";
import MemeSelection from "./MemeSelection";


//*** Below what we have in the data. See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***        data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {step: "[\"ListEmotions\"]", word:""}},
//***               current_user_id: ...,
//***               time_period:{...}
function ListEmotions({ data,  setData , saveDataToDb, steps, service}) {
  const {isLoading, error} = service
  const emotions = data.data
  const timePeriod = data.time_period

  const clickHandling = (emotion_word, emotion_id, timePeriod_id, category) => {
    steps.push('MemeSelection')
    const dataRequest = {
      response:{
        emotion_id: emotion_id,
        word: emotion_word,
        category: category,
        id: data.current_user_id,
        time_period_id: data.time_period.id
      }}
    saveDataToDb( steps, dataRequest )
  }

  const range_format = tp => {
    let start_date = new Date(tp.start_date)
    let   end_date = new Date(tp.end_date)
    let      month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
    return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
  }

  //*** **transformation of table** to the view:
  //*** 6+6(positive columns) 6+6(neutral columns) and 6+6(negative columns)
  const mix_up = index => ( index - 6 * (Math.ceil( index / 6 ) - 1 )) * 6 - (Math.ceil ( index / 6 ) - 1 ) - 1

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error && !!emotions.length &&
        <div>
          <div className="convert increased-convert in_left">
            <p>Logo/Brand</p>
            <div className="line1 offset-line1"></div>
            <div className="line2 offset-line2"></div>
          </div>
          <h3 className="under-convert uc-new-position">Time for this week's check-in!</h3>
          <div className="calendar other-position">
            <div className="left-div offset-ld">
              <div className="part"></div>
            </div>
            <div className="right-div offset-rd">
              <div className="part"></div>
            </div>
            <div className="top-div"></div>
            <div className="time">
              {range_format(timePeriod)}
            </div>
          </div>
          <br/>
          <div className="question q-new-pos">Which word best describes how you felt work this week?</div>
            <div className='field_empty'></div>
              <div className='field_emotions'>
                {emotions.map((emotion, index) =>
                   <ButtonEmotion key={emotion.id}
                                  category={emotions[mix_up(index+1)].attributes.category}
                                  onClick={() =>
                                    clickHandling(
                                      emotions[mix_up(index+1)].attributes.word,
                                      emotions[mix_up(index+1)].id,
                                      timePeriod.id,
                                      emotions[mix_up(index+1)].attributes.category
                                  )}>{emotions[mix_up(index+1)].attributes.word}
                     
                   </ButtonEmotion>
                )}
              </div>
            <div className='field_empty'></div>
          <div className="share sh-new-pos">Share it in your own words!</div>


          <BtnAddYourOwnWord className="link_first" content="Add your own word" onClick={()=>{}}/>
          <NavLink className ="nav-link" to="">I was not working this week</NavLink>


          <QuestionButton style={{position: 'absolute', right: 47}}/>
          <ShoutoutButton style={{position: 'absolute', left: 45}}/>
          <Menu style={{position: 'absolute', right: 47, top: 62}}>X% complete</Menu>
        </div>}


      { !isLoading && error && <p>{ error }</p> }
      { isLoading && !error && <p>...Loading </p> }
    </Fragment>
  );
}

export default ListEmotions;