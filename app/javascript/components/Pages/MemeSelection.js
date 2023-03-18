import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import Gif from "./Gifs";
import {BigBtnEmotion, BtnOutline, BtnPrimary, LeftPanel, RightPanel} from "../UI/ShareContent";
import {backHandling} from "../helpers/helpers";

const MemeSelection = ({data, setData, saveDataToDb, steps, service}) => {
  const {emotion, api_giphy_key, response} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [gifUrl, setGifUrl] = useState(response.attributes.gif_url || '')
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);

  const handlingOnClickSkip = () =>{
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( steps , { gif_url: null })
  }

  const chooseGIPHYHandling = () => {
    steps.push('SelectedGIPHYFollow')
    saveDataToDb(steps, { gif_url: gifUrl })
  }
  const uploadGIPHYHandling = () =>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( steps ,{})
  }

  useEffect(()=>{
    navigate(`/${JSON.parse(response.attributes.steps).pop()}`);
  },[])

  const Footer = () =>
    <div className='mt-1'>
      <div className='d-flex justify-content-between footer gap-3'>
        <div>
          <h4 className='mt-4 mb-0'>Share it in your way!</h4>
          <BtnOutline text='Upload your own meme!' onClick={uploadGIPHYHandling} />
        </div>
        <div style={{marginTop: 52}}>
          <BtnPrimary text='Next' onClick={chooseGIPHYHandling} hidden={selectedGifIndex === null} />
          <BtnPrimary text='Skip' onClick={handlingOnClickSkip} hidden={selectedGifIndex !== null} />
        </div>
      </div>
    </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <div className="row text-center">
    <LeftPanel />
    <div className='col-8 mt-5'>
      <h4 className='text-muted mb-2'>You picked:</h4>
      <BigBtnEmotion emotion={emotion} onClick={backHandling} />
      <Gif {...{emotion, api_giphy_key, setGifUrl, selectedGifIndex, setSelectedGifIndex}} />
      <Footer />
    </div>
    <RightPanel />
  </div>
}

export default MemeSelection;