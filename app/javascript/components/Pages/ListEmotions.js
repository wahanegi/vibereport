import React, {Fragment, useEffect, useState} from 'react'
import ButtonEmotion from "../UI/ButtonEmotion"
import axios from "axios"
import {NavLink} from 'react-router-dom'
import QuestionButton from "../UI/QuestionButton";
import Menu from "../UI/Menu";
import ShoutoutButton from "../UI/ShoutoutButton";
import {createResponse, updateResponse} from "../requests/axios_requests";
import {useNavigate} from "react-router-dom";
import {isEmpty} from "../helpers/helper";
import BtnAddYourOwnWord from "../UI/BtnAddYourOwnWord";

function ListEmotions(props) {
  const [emotions, setEmotions] = useState([])
  const [timePeriod, setTimePeriod] = useState({})
  const [curUserId, setCurUserId] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate();
  const [response, setResponse] = useState({})

  useEffect(()=>{
    setIsLoading(true)
    axios.get('/api/v1/emotions.json')
      .then( response => {
        const received = response.data
        setEmotions(received.data)
        setTimePeriod(received.time_period)
        setCurUserId(received.current_user_id)
        setIsLoading(false)
        setResponse(received.response)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  },[])

  const clickHandling = (emotion_id, timePeriod_id, navigate, response) => {
    if (isEmpty(response)) {
      createResponse(emotion_id, timePeriod_id, navigate, 'MemeSelection')
    } else {
      const updatedResponse = {
        ...response,
        attributes: {
          ...response.attributes,
          emotion_id,
          step: 'MemeSelection'
        }
      }
      updateResponse(updatedResponse, setResponse).then(() => navigate(`/responses/${response.id}`))
    }
  }

  const onClickNotWorking = (timePeriod_id, navigate, response) => {
    if (isEmpty(response)) {
      createResponse('', timePeriod_id, navigate, '', false)
    } else {
      const updatedResponse = {
        ...response,
        attributes: {
          ...response.attributes,
          emotion_id: '',
          step: '',
          not_working: true
        }
      }
      updateResponse(updatedResponse, setResponse).then(() => navigate(`/app/results`))
    }
  }

  const rangeFormat = (tp) => {
    let start_date = new Date(tp.start_date)
    let end_date = new Date(tp.end_date)
    let month = end_date.toLocaleString('default', {month: 'long'}).slice(0,3)
    return `${start_date.getDate()}`.padStart(2, '0') + '-' + `${end_date.getDate()}`.padStart(2, '0') + ' ' + month
  }

  const categoryToWords = (attr) =>  attr === 1 ? "positive" : attr === 3 ? "negative" : "neutral"

  const mixUp = (index) => ( index - 6 * (Math.ceil( index / 6 ) - 1 )) * 6 - (Math.ceil ( index / 6 ) - 1 ) - 1

  return (
    <Fragment>
        {isLoading ? ( <p>...Loading</p> ) : error ? ( <p>{error}</p>
        ) : (
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
              {rangeFormat(timePeriod)}
            </div>
          </div>
          <br/>
          <div className="question q-new-pos">Which word best describes how you felt work this week?</div>
            <div className='field_empty'></div>
              <div className='field_emotions'>
                {emotions.map((emotion, index) =>
                   <ButtonEmotion key={emotion.id}
                                  category={emotions[mixUp(index+1)].attributes.category}
                                  onClick={() => clickHandling(emotions[mixUp(index+1)].id, timePeriod.id, navigate, response)}>{emotions[mixUp(index+1)].attributes.word}
                     
                   </ButtonEmotion>
                )}
              </div>
            <div className='field_empty'></div>
          <div className="share sh-new-pos">Share it in your own words!</div>
          <BtnAddYourOwnWord className="link_first" content="Add your own word" onClick={()=>{}}/>
          <NavLink className="nav-link" onClick={() => onClickNotWorking(timePeriod.id, navigate, response)}>
            I was not working this week
          </NavLink>
          <QuestionButton style={{position: 'absolute', right: 47}}/>
          <ShoutoutButton style={{position: 'absolute', left: 45}}/>
          <Menu style={{position: 'absolute', right: 47, top: 62}}>X% complete</Menu>
        </div>
        )}
    </Fragment>
  );
}

export default ListEmotions;