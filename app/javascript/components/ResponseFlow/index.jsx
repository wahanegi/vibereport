import React, {useEffect, useState, Fragment} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const ResponseFlow = () => {
  const [response, setResponse] = useState({})
  const [emotion, setEmotion] = useState({})
  const [loaded, setLoaded] = useState(false)
  const params = useParams();

  useEffect(()=> {
    const url = `/api/v1/responses/${params.id}`
    axios.get(url)
      .then(resp => {
        setResponse(resp.data.data)
        setEmotion(resp.data.emotion)
        setLoaded(true)
      })
      .catch(resp => console.log(resp))
  }, [])

  return(
    <Fragment>
      { loaded &&
        <Fragment>
          <div>Response id: {response.id}</div>
          <div>Response user_id: {response.attributes.user_id}</div>
          <div>Response time_period_id: {response.attributes.time_period_id}</div>
          <div>Response emotion_id: {response.attributes.emotion_id}</div>
          <h4>Emotion: {emotion.word}</h4>
        </Fragment>
      }
    </Fragment>
  )
}

export default ResponseFlow