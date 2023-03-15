import React, {Fragment, useEffect, useState} from "react"
import {Button} from "react-bootstrap";
import BackButton from "../UI/BackButton";
import {isEmpty} from "../helpers/helper";
import {useNavigate} from "react-router-dom";
import {apiRequest} from "../requests/axios_requests";

//*** Below what we have in the data after ListEmotion(example). See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***               data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {steps: "[\"ListEmotions\", "\MemeSelection"]",
//***                                      word:"awesome"},
//***                                      category: "positive",
//***                                      emotion_id:1,
//***                                      time_period_id: 1,
//***                                      id: 1},
//***               current_user_id: 1,
//***               time_period:{...}
const MemeSelection = ({data, setData, saveDataToDb, steps, service}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {isLoading1, error, setIsLoading1} = service
  const emotionId = data.response.attributes.emotion_id

  const handlingOnClickSkip = () =>{
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( steps ,{})
    }

  const chooseGIPHYHandling=()=>{
    steps.push('SelectedGIPHYFollow')
    saveDataToDb( steps ,{})
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( steps ,{})
  }

  useEffect(()=>{
      navigate(`/${JSON.parse(data.response.attributes.steps).pop()}`);
  },[])

  return(
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
      <div>
        <h1>2.0 MemeSelection</h1>
        <h1>You choose such emotion word
          {" " + data.chosenEmotion.word} with id = {emotionId}
        </h1>
        <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
        <div><Button onClick={handlingOnClickSkip}>Skip</Button></div>
        <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
      </div>}
    </Fragment>
  )
}

export default MemeSelection;