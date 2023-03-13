import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import MemeSelection from "./Pages/MemeSelection";

const For_delete = () => {
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
      return <MemeSelection emotion={emotion} />
  }
}

export default For_delete
