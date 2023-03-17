import React, {useEffect, useState} from "react"
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Gif from "./Gifs";
import {LeftPanel, RightPanel} from "./Share/ShareContent";

const MemeSelection = ({data, setData, saveDataToDb, steps, service}) => {
  const {emotion, api_giphy_key} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [gifUrl, setGifUrl] = useState(data.response.attributes.gif_url || '')
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);

  const handlingOnClickSkip = () =>{
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( steps , { gif_url: null })
  }

  const chooseGIPHYHandling = () => {
    steps.push('SelectedGIPHYFollow')
    saveDataToDb(steps, { gif_url: gifUrl })
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( steps ,{})
  }

  useEffect(()=>{
      navigate(`/${JSON.parse(data.response.attributes.steps).pop()}`);
  },[])

  const Footer = () => <div className='d-flex justify-content-between footer'>
    <Button className='m-1' onClick={uploadGIPHYHandling}>Upload your own meme!</Button>
    <div>
      <Button className='m-1' onClick={chooseGIPHYHandling} hidden={selectedGifIndex === null}>Next</Button>
      <Button className='m-1' onClick={handlingOnClickSkip} hidden={selectedGifIndex !== null}>Skip</Button>
    </div>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <div className="row text-center">
    <LeftPanel />
    <div className='col-6' style={{marginTop: 150}}>
      <h4 className='text-muted mb-2'>You picked:</h4>
      <button className={`btn-emotion ${emotion.category} mb-2`}><span className="edit-icon"></span>{emotion.word}</button>
      <Gif {...{emotion, api_giphy_key, setGifUrl, selectedGifIndex, setSelectedGifIndex}} />
      <Footer />
    </div>
    <RightPanel />
  </div>
}

export default MemeSelection;