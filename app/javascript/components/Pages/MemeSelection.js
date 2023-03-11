import React, {Fragment, useEffect, useState} from "react"
import * as ReactRouterDOM from "react-router-dom"
import {Button} from "react-bootstrap";
import {redirect, useNavigate, useParams} from "react-router-dom";
import {updateResponse} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helper";
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
const MemeSelection = ({data, setData}) => {
  const [response, setResponse] = useState({})

  const navigate = useNavigate();
  const steps = JSON.parse(data.response.attributes.step)
  const emotionId = data.response.attributes.emotion_id
  const emotionWord = data.response.attributes.word

  const skipHandling =()=>{
    steps.push('FollowUpPosWordOnly')
    console.log(" skipHandling steps = ", steps)
    const updatedResponse = {
      ...data.response,
      attributes: {
        ...data.response.attributes,
        step: JSON.stringify(steps)
      }
    }
    setData({...data, response: {...data.response, attributes: {...updatedResponse.attributes}}})
    updateResponse(updatedResponse, setResponse)
  }

  useEffect(()=>{
    if(!isEmpty(response)){
      console.log("skipHandling useEffect steps=", response.attributes)
      navigate(`/${JSON.parse(response.attributes.step).pop()}`);
      // window.location.replace(`/${JSON.parse(response.attributes.step).pop()}`);
    }
  },[response])
  const chooseGIPHYHandling=()=>{
    steps.push('SelectedGIPHYFollow')
    console.log(" skipHandling steps = ", steps)
    const updatedResponse = {
      ...data.response,
      attributes: {
        ...data.response.attributes,
        step: JSON.stringify(steps)
      }
    }
    setData({...data, response: {...data.response, attributes: {...updatedResponse.attributes}}})
    updateResponse(updatedResponse, setResponse)
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    console.log(" skipHandling steps = ", steps)
    const updatedResponse = {
      ...data.response,
      attributes: {
        ...data.response.attributes,
        step: JSON.stringify(steps)
      }
    }
    setData({...data, response: {...data.response, attributes: {...updatedResponse.attributes}}})
    updateResponse(updatedResponse, setResponse)
  }


  return(
    <Fragment>
      <h1>You choose such emotion word
        {" " + emotionWord} with id = {emotionId}
      </h1>
      <div><BackButton data={data} setData={setData}>Back</BackButton></div>
      <div><Button onClick={skipHandling}>Skip</Button></div>
      <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
      <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
    </Fragment>
  )
}

export default MemeSelection;