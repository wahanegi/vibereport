import React, { Fragment } from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import { NavLink } from 'react-router-dom'
import BtnAddYourOwnWord from "../UI/BtnAddYourOwnWord";
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";

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
      user_id: data.current_user.id,
      comment: '',
      rating: '',
      productivity: '0',
    }
    saveDataToDb( steps, dataRequest )
  }

  const ownWordHandling = () => {
    steps.push('emotion-entry')
    const dataRequest = {
      time_period_id: data.time_period.id,
      user_id: data.current_user.id,
    }
    saveDataToDb( steps, dataRequest )
  }

  const onClickNotWorking = () => {
    steps.push('results')
    const dataRequest = {
      emotion_id: '',
      not_working: true,
      time_period_id: timePeriod.id,
      user_id: data.current_user.id,
    }
    saveDataToDb( steps, dataRequest )
  }

  const rangeFormat = (tp) => {
    const dueDate = new Date(tp.due_date)
    const month = dueDate.toLocaleString('default', {month: 'long'}).slice(0,3)
    return month + ' ' + `${dueDate.getDate()}`.padStart(2, '0')
  }

  const notSayHandling = () => {
    steps.push('rather-not-say')
    saveDataToDb( steps )
  }
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
                 {rangeFormat(timePeriod)}
               </div>
             </div>
          </div>
          <div className="invitation mx-auto p-0">Time for your latest check-in!</div>
          <div className="mx-auto my-0 question">Which word best describes how you’ve recently felt about work?</div>
            <div className='d-flex mx-auto emotions'>
                {emotions.map((emotion, index) =>
                  <div className='width-block' key={emotion.id}>
                   <ButtonEmotion key={emotion.id}
                                  category={emotions[index].attributes.category}
                                  onClick={() =>
                                    clickHandling(
                                      emotions[index].attributes.word,
                                      emotions[index].id
                                  )}>{emotions[index].attributes.word}
                     
                   </ButtonEmotion>
                  </div>
                )}
              </div>
          <div className='neutral-area'>
            <Button className='btn btn-bubbles neutral wb1 not-standart' onClick={notSayHandling}>I'd rather not say...</Button>
          </div>
          <div className="big-btn-tooltip correct">Share it in your own words!</div>
          <div className="big-btn">
          <BtnAddYourOwnWord className="link-text c3" content="Add your own word" onClick={ownWordHandling}/>
          </div>
          <NavLink className="lnk-was-not  mx-auto my-0" onClick={onClickNotWorking} to={''}>
            I was not working recently
          </NavLink>
          <CornerElements         data = { data }
                               setData = { setData }
                     percentCompletion = {0}/>
        </div>
      }
    </Fragment>
  );
}

export default ListEmotions;