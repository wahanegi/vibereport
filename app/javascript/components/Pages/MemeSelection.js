import React, {Fragment, useEffect, useState} from "react"
import Button from "../UI/Button"
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
      navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])
// id:"2.0", step: "meme-selection"
  return(
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
      <div>
        <h1>{data.emotion.word}</h1>
        <div><Button onClick={chooseGIPHYHandling}>Choose</Button></div>
        <div><Button className='btn btn-primary' onClick={handlingOnClickSkip}>Skip</Button></div>
        <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
      </div>}
    </Fragment>
  )
}

export default MemeSelection;