import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import Gif from "./Gifs";
import {
  BigBtnEmotion,
  BtnOutline,
  BtnPrimary,
  Header, HelpIcon, Logo, ShoutOutIcon,
  Wrapper
} from "../UI/ShareContent";
import {backHandling, isBlank, isPresent} from "../helpers/helpers";
import {GIPHY_UPLOAD_URL} from "../helpers/consts";
import Menu from "../UI/Menu";

const MemeSelection = ({data, setData, saveDataToDb, steps, service, isCustomGif, setIsCustomGif}) => {
  const {emotion, api_giphy_key, response} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [gifUrl, setGifUrl] = useState(response.attributes.gif_url || '')
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);

  const handlingOnClickSkip = () =>{
    steps.push('emotion-intensity')
    saveDataToDb( steps , { gif_url: null })
  }

  const chooseGIPHYHandling = () => {
    if (emotion.category === "neutral") {
      steps.push('ProductivityCheckLow');
    } else {
      steps.push('selected-giphy-follow');
    }
    saveDataToDb(steps, { gif_url: gifUrl });
  }
  
  const uploadGIPHYHandling = () => {
    window.open(GIPHY_UPLOAD_URL, '_blank');
  }

  useEffect(()=>{
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
    },[])

  const FooterIcons = () => <div className='d-flex justify-content-between gap-3 m-3'>
    <ShoutOutIcon />
    <HelpIcon />
  </div>

  const Navigation = () =>
    <div className='d-flex justify-content-between gap-3'>
      <div>
        <h4 className='mt-4 mb-0'>Share it in your way!</h4>
        <BtnOutline text='Upload your own meme!' onClick={uploadGIPHYHandling} />
      </div>
      <div style={{marginTop: 52}}>
        <BtnPrimary text='Next' onClick={chooseGIPHYHandling} hidden={isBlank(gifUrl)} />
        <BtnPrimary text='Skip' onClick={handlingOnClickSkip} hidden={isPresent(gifUrl)} />
      </div>
    </div>

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <div className='mt-3' style={{marginLeft: '-101px'}}>
      <h4 className='text-muted mb-1'>You picked:</h4>
      <BigBtnEmotion emotion={emotion} onClick={backHandling} addClass='mb-2' />
    </div>
    <Menu>X% complete</Menu>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='w-75 align-self-center'>
      <Gif {...{emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, isCustomGif, setIsCustomGif}} />
      <Navigation />
    </div>
    <FooterIcons />
  </Wrapper>
}

export default MemeSelection;