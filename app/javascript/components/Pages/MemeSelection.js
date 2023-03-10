import React, {Fragment, useEffect, useState} from "react"
import * as ReactRouterDOM from "react-router-dom"
import {Button} from "react-bootstrap";
import {redirect, useNavigate, useParams} from "react-router-dom";
import {updateResponse} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helper";
import BackButton from "../UI/BackButton";

const MemeSelection = ({data, setData}) => {
  const emotion_id = data.response.attributes.emotion_id
  const useSearchParams  = ReactRouterDOM.useSearchParams
  const [response, setResponse] = useState({})

  const navigate = useNavigate();
  const steps = JSON.parse(data.response.attributes.step)
  const find = data.data.find(element => element.id === emotion_id)

  console.log("find=", find)
  if (find === undefined) {
    steps.pop()
    console.log("find === undefined - ", steps)
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
        {" " + data.data.find(element => element.id === emotion_id).attributes.word} with id = {emotion_id}
      </h1>
      <div><BackButton data={data} setData={setData}>Back</BackButton></div>
      <div><Button onClick={skipHandling}>Skip</Button></div>
      <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
      <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
    </Fragment>
  )
}

export default MemeSelection;