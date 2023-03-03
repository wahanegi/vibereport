import React, {useEffect, useState, Fragment} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const MemeSelection = () => {
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
          <h4>{emotion.word}</h4>
        </Fragment>
      }
    </Fragment>
  )
}

export default MemeSelection;