import React, { Fragment } from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import { NavLink} from 'react-router-dom'
import Menu from "../UI/Menu";
import BtnAddYourOwnWord from "../UI/BtnAddYourOwnWord";
import {Calendar, HelpIcon, Logo, ShoutOutIcon} from "../UI/ShareContent";

//*** Below what we have in the data. See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***        data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {steps: "[\"ListEmotions\"]", word:""}},
//***               current_user_id: ...,
//***               time_period:{...}
function ListEmotions({ data,  setData , saveDataToDb, steps, service}) {
  const {isLoading, error} = service
  const emotions = data.data
  const timePeriod = data.time_period
  const clickHandling = (emotion_word, emotion_id) => {
    steps.push('meme-selection')
    const dataRequest = {
      emotion_id: emotion_id,
      time_period_id: timePeriod.id,
      user_id: data.current_user_id,
    }
    saveDataToDb( steps, dataRequest )
  }

  const ownWordHandling = () => {
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
      time_period_id: timePeriod.id,
      user_id: data.current_user_id,
    }
    saveDataToDb( steps, dataRequest )
  }

  //*** **transformation of table** to the view:
  //*** 6+6(positive columns) 6+6(neutral columns) and 6+6(negative columns)
  const mixUp = (index) => ( index - 6 * (Math.ceil( index / 6 ) - 1 )) * 6 - (Math.ceil ( index / 6 ) - 1 ) - 1

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
        <div className="board">
          <div className='d-flex justify-content-between m-3 '>
            <Logo />
            <Menu>X% complete</Menu>
          </div>
          <Calendar timePeriod={timePeriod} />
          <div className="invitation mx-auto p-0">Time for this week's check-in!</div>
          <div className="mx-auto my-0 question">Which word best describes how you felt at work this week?</div>
            <div className='d-flex mx-auto emotions'>
                {emotions.map((emotion, index) =>
                   <ButtonEmotion key={emotion.id}
                                  category={emotions[mixUp(index+1)].attributes.category}
                                  onClick={() =>
                                    clickHandling(
                                      emotions[mixUp(index+1)].attributes.word,
                                      emotions[mixUp(index+1)].id
                                  )}>{emotions[mixUp(index+1)].attributes.word}
                     
                   </ButtonEmotion>
                )}
            </div>
          <div className="big-btn-tooltip">Share it in your own words!</div>
          <div className="big-btn">
          <BtnAddYourOwnWord className="link-text" content="Add your own word" onClick={ownWordHandling}/>
          </div>
          <div className='d-flex justify-content-between m-3 '>
            <ShoutOutIcon />
            <NavLink className="lnk-was-not  mx-auto my-0 " onClick={onClickNotWorking} to={''}>
              I was not working this week
            </NavLink>
            <HelpIcon />
          </div>
        </div>
      }
    </Fragment>
  );
}

export default ListEmotions;