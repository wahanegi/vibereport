import React, {Fragment, useEffect, useState} from "react"
import {Button} from "react-bootstrap";
import BackButton from "../UI/BackButton";

//*** Below what we have in the data after ListEmotion(example). See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***               data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {step: "[\"ListEmotions\", "\MemeSelection"]",
//***                                      word:"awesome"},
//***                                      category: "positive",
//***                                      emotion_id:1,
//***                                      time_period_id: 1,
//***                                      id: 1},
//***               current_user_id: 1,
//***               time_period:{...}
const MemeSelection = ({data, setData, saveDataToDb}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const steps = JSON.parse(data.response.attributes.step)
  const emotionId = data.response.attributes.emotion_id
  const emotionWord = data.response.attributes.word

  const handlingOnClickSkip = () =>{
    setIsLoading(true)
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( setError, steps ,{})
    }

  const chooseGIPHYHandling=()=>{
    steps.push('SelectedGIPHYFollow')
    saveDataToDb( setError, steps ,{})
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( setError, steps ,{})
  }

  useEffect(()=>{
    setIsLoading(false)
  },[data])

  return(
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
      <div>
        <h1>You choose such emotion word
          {" " + emotionWord} with id = {emotionId}
        </h1>
        <div><BackButton data={data} setData={setData}>Back</BackButton></div>
        <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
        <div><Button onClick={handlingOnClickSkip}>Skip</Button></div>
        <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
      </div>}
    </Fragment>
  )
}

export default MemeSelection;