import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import Gif from "./Gifs";
import {
  BigBtnEmotion,
  BtnOutline,
  BtnPrimary,
  Header,
  Wrapper
} from "../UI/ShareContent";
import {backHandling, isBlank, isPresent} from "../helpers/helpers";
import {GIPHY_UPLOAD_URL} from "../helpers/consts";
import CornerElements from "../UI/CornerElements";

const MemeSelection = ({data, setData, saveDataToDb, steps, service, isCustomGif, setIsCustomGif, draft}) => {
  const {emotion, api_giphy_key, response} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [gifUrl, setGifUrl] = useState(response.attributes.gif_url || '')
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = {gif_url: gifUrl, draft: true}
    saveDataToDb(steps, dataDraft);
    setIsDraft(true)
  }

  useEffect(() => {
    if (gifUrl !== response.attributes.gif_url && isDraft) {
      setIsDraft(false);
    }
  }, [gifUrl]);

  const handlingOnClickSkip = () =>{
    if (emotion.category === "neutral") {
      steps.push('productivity-check');
    } else {
      steps.push('emotion-intensity')
    }
    saveDataToDb( steps , { gif_url: null, draft: false })
  }

  const chooseGIPHYHandling = () => {
    if (emotion.category === "neutral") {
      steps.push('productivity-check');
    } else {
      steps.push('selected-giphy-follow');
    }
    saveDataToDb(steps, { gif_url: gifUrl, draft: false });
  }
  
  const uploadGIPHYHandling = () => {
    window.open(GIPHY_UPLOAD_URL, '_blank');
  }

  useEffect(()=> {
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])


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

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-8'>
    <div className='mx-auto' >
      <h5 style={{opacity: 0.6}}>You picked:</h5>
      <BigBtnEmotion emotion={emotion} onClick={backHandling} />
    </div>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='align-self-center gif-wrap'>
        <Gif {...{emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, isCustomGif, setIsCustomGif}} />
      <Navigation />
    </div>
    <CornerElements data = { data }
                    setData = { setData }
                    saveDataToDb={saveDataToDb}
                    steps={steps}
                    draft={isDraft}
                    handleSaveDraft={handleSaveDraft} />
  </Wrapper>
}

export default MemeSelection;