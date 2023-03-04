import React, {useEffect, useState, Fragment} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import MemeSelection from "./MemeSelection";
import EmotionEntry from "../Pages/EmotionEntry";
import Results from "../Pages/Results";

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
  }, [response.length])

  if (!loaded) return <p>Loading...</p>

  switch (response.attributes.step) {
    case 'MemeSelection':
      return <MemeSelection emotion={emotion} response={response} setResponse={setResponse} />
    case 'EmotionEntry':
      return <EmotionEntry response={response} setResponse={setResponse} />
    case 'Results':
      return <Results response={response} setResponse={setResponse} />
  }
}

export default ResponseFlow
