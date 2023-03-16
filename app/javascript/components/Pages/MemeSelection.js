import React, {Fragment, useEffect, useState} from "react"
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const MemeSelection = ({data, setData, saveDataToDb, steps, service}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {isLoading1, error, setIsLoading1} = service

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
// id:"2.0", step: "meme-selection"
  return(
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
      <div>
        <h1>{data.emotion.word}</h1>
        <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
        <div><Button onClick={handlingOnClickSkip}>Skip</Button></div>
        <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
      </div>}
    </Fragment>
  )
}

export default MemeSelection;