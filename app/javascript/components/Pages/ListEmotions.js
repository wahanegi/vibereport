import React, {Fragment, useEffect, useState} from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import axios from "axios"
import {getElementFromSelector} from "bootstrap/js/src/util";
import Input from '../UI/Input'
import {NavLink} from 'react-router-dom'
import QuestionButton from "../UI/QuestionButton";
import Menu from "../UI/Menu";
import ShoutoutButton from "../UI/ShoutoutButton";

// import styles from './ListEmotions.module.css'

function ListEmotions(props) {
  const [emotions, setEmotions] = useState([])
  const [timePeriod, setTimePeriod] = useState([])
  const [curUserId, setCurUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(()=>{
    setIsLoading(true)
    axios.get('/api/v1/emotions')
      .then( response => {
        const received = response.data
        setEmotions(received.data)
        setTimePeriod(received.time_period)
        setCurUserId(received.current_user_id)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  },[])

  const clickHandling = () => {

  }

  const range_format = tp => {
    let start_date = new Date(tp.start_date)
    let end_date = new Date(tp.end_date)
    let month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
    return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
  }

  const categoryToWords = attr =>  attr === 1 ? "positive" : attr === 3 ? "negative" : "neutral"

  const mix_up = index => ( index - 6 * (Math.ceil( index / 6 ) - 1 )) * 6 - (Math.ceil ( index / 6 ) - 1 ) - 1

  return (
    <Fragment>
      { !isLoading && !error &&
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
                {emotions.map((is_not_used, index) =>
                   <ButtonEmotion key={emotions[mix_up(index+1)].id}
                                  category={emotions[mix_up(index+1)].attributes.category}
                                  onClick={clickHandling(emotions[mix_up(index+1)].id)}>
                     {emotions[mix_up(index+1)].attributes.word}
                   </ButtonEmotion>
                )}
              </div>
            <div className='field_empty'></div>
          <div className="share sh-new-pos">Share it in your own words!</div>
          <div className="own_word">
              <input type='text' placeholder="Add your own word"/>
          </div>
            <NavLink className ="link" to="">I was not working this week</NavLink>
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