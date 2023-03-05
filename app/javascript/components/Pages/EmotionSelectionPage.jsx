import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import {Button} from "react-bootstrap";
import {createResponse, updateResponse} from "../requests/axios_requests";
import {useNavigate} from "react-router-dom";
import {isEmpty} from "../helpers/helper";

const EmotionSelectionPage = () => {
  const [emotions, setEmotions] = useState([])
  const [response, setResponse] = useState({})
  const [currentUserId, setCurrentUserId] = useState({})
  const [timePeriod, setTimePeriod] = useState({})
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate();

  useEffect(()=> {
    axios.get('/api/v1/emotions.json')
      .then( resp => {
        setCurrentUserId(resp.data.current_user_id)
        setResponse(resp.data.response)
        setEmotions(resp.data.data)
        setTimePeriod(resp.data.time_period)
        setLoaded(true)
      })
      .catch(resp => console.log(resp))
  }, [emotions.length])

  if (!loaded) return <p>Loading...</p>

  const onHandleClick = (emotion_id, timePeriod_id, navigate, response) => {
    if (isEmpty(response)) {
      createResponse(emotion_id, timePeriod_id, navigate, 'MemeSelection')
    } else {
      response.attributes['emotion_id'] = emotion_id
      response.attributes['step'] = 'MemeSelection'
      updateResponse(response, setResponse).then(navigate(`/responses/${response.id}`))
    }
  }

  return loaded && <Fragment>
    <h3>Current_user id: {currentUserId}</h3>
    <h3>Time period id: {timePeriod.id}, start_date: {timePeriod.start_date} end_date: {timePeriod.end_date}</h3>
    <div>
      {
        emotions.map(emotion =>
          <div key={emotion.id} className={'col m-2'}>
            <Button onClick={() => onHandleClick(emotion.id, timePeriod.id, navigate, response)}>{emotion.attributes.word}</Button>
          </div>
        )
      }
    </div>
  </Fragment>
}

export default EmotionSelectionPage
