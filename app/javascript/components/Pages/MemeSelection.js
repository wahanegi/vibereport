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
  const [gifUrl, setGifUrl] = useState(response.attributes.gif || {})
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);

  const handlingOnClickSkip = () =>{
    if (emotion.category === "neutral") {
      steps.push('productivity-check');
    } else {
      steps.push('emotion-intensity')
    }
    saveDataToDb( steps , { gif: null })
  }

  const chooseGIPHYHandling = () => {
    console.log('gifUrl', gifUrl)
    if (emotion.category === "neutral") {
      steps.push('productivity-check');
    } else {
      steps.push('selected-giphy-follow');
    }
    saveDataToDb(steps, { gif: gifUrl });
  }
  
  const uploadGIPHYHandling = () => {
    window.open(GIPHY_UPLOAD_URL, '_blank');
  }

  useEffect(()=> {
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])

  const FooterIcons = () => <div className='d-flex justify-content-between gap-3 mx-3 mb-2'>
    <ShoutOutIcon />
    <HelpIcon />
  </div>

  const Navigation = () =>
    <div className='d-flex justify-content-between gap-3'>
      <div>
        <h5 className='mt-2 mb-0 text-muted'>Share it in your way!</h5>
        <BtnOutline text='Upload your own meme!' onClick={uploadGIPHYHandling} />
      </div>
      <div style={{marginTop: 52}}>
        <BtnPrimary text='Next' onClick={chooseGIPHYHandling} hidden={isBlank(gifUrl)} />
        <BtnPrimary text='Skip' onClick={handlingOnClickSkip} hidden={isPresent(gifUrl)} />
      </div>
    </div>

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <div className='mt-5' style={{marginLeft: '-101px'}}>
      <h5 style={{opacity: 0.6}}>You picked:</h5>
      <BigBtnEmotion emotion={emotion} onClick={backHandling} />
    </div>
    <Menu>X% complete</Menu>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='align-self-center gif-wrap'>
      <Gif {...{emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, isCustomGif, setIsCustomGif}} />
      <Navigation />
    </div>
    <FooterIcons />
  </Wrapper>
}

export default MemeSelection;