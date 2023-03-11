import React, {Fragment, useEffect, useState} from "react"
import * as ReactRouterDOM from "react-router-dom"
import {Button} from "react-bootstrap";
import {redirect, useNavigate, useParams} from "react-router-dom";
import {apiRequest, updateResponse} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helper";
import BackButton from "../UI/BackButton";
import {mergeData} from "../helper_functions/library";

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const navigate = useNavigate();
  const steps = JSON.parse(data.response.attributes.step)
  const emotionId = data.response.attributes.emotion_id
  const emotionWord = data.response.attributes.word

  const handlingOnClickSkip = () =>{
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( steps ,{})
    }
    const saveDataToDb = (steps, addedData = {}) =>{
      const dataRequest = {response:{step: JSON.stringify(steps),...addedData}}
      setIsLoading(true)
      //request to the Response controller
      //update record in the Response table
      apiRequest("PATCH", dataRequest, saveDataToAttributes).catch(e=>setError(e))
    }

  //***  include received data from the apiRequest to the variable **:data** (**:emotionDataRespUserIdTimePeriod** in App)
  const saveDataToAttributes =( receivedData ) =>{
    mergeData( receivedData, data, setData )
    navigate(`/${JSON.parse(data.response.attributes.step).pop()}`)
    setIsLoading(false)
  }

  // useEffect(()=>{
  //   if(!isEmpty(response)){
  //     console.log("skipHandling useEffect steps=", response.attributes)
  //     navigate(`/${JSON.parse(data.response.attributes.step).pop()}`);
  //     // window.location.replace(`/${JSON.parse(response.attributes.step).pop()}`);
  //   }
  // },[response])
  const chooseGIPHYHandling=()=>{
    steps.push('SelectedGIPHYFollow')
    saveDataToDb( steps ,{})
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( steps ,{})
  }


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