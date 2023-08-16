import React, {useEffect, useState, useRef} from "react"
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
  const [gifUrl, setGifUrl] = useState(response.attributes.gif || {})
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(draft);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveDraft = () => {
    const dataDraft = {gif: gifUrl, draft: true}
    saveDataToDb(steps, dataDraft);
    setIsDraft(true)
  }

  useEffect(() => {
    if (gifUrl !== response.attributes.gif && isDraft) {
      setIsDraft(false);
    }
  }, [gifUrl]);

  const handlingOnClickSkip = () =>{
    steps.push('emotion-intensity')
    saveDataToDb( steps , { gif: null, draft: false })
  }

  const chooseGIPHYHandling = () => {
    steps.push('selected-giphy-follow');
    saveDataToDb(steps, { gif: gifUrl, draft: false });
  }
  console.log('selectedFile', selectedFile)
  console.log('gifUrl', gifUrl)
  const uploadGIPHYHandling = async () => {
    setUploading(true)
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('api_key', api_giphy_key);

    try {
      const response = await fetch('https://upload.giphy.com/v1/gifs', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      const uploadedGifUrl = 'https://media.giphy.com/media/' + responseData.data.id + '/giphy.gif'
      setGifUrl({src: uploadedGifUrl})
      setIsCustomGif(true)
      console.log('Upload response:', responseData);
      setSelectedFile(null)
      setUploading(false)
    } catch (error) {
      setUploading(false)
      console.error('Upload error:', error);
    }
  };
  console.log('Uploading', uploading);
  useEffect(()=> {
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])

  useEffect(()=> {
    selectedFile && uploadGIPHYHandling();
  },[selectedFile])


  const Navigation = () =>
    <div className='d-flex justify-content-between gap-3 pb-45'>
      <div>
        <h5 className='mt-2 mb-0 text-muted'>Share it in your way!</h5>
        <div>
          <BtnOutline text='Upload your own meme!' onClick={handleButtonClick} />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
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
        <Gif {...{emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex,
                  setSelectedGifIndex, isCustomGif, setIsCustomGif, uploading}} />
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