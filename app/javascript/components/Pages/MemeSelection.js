import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {backHandling, gifUrlWithId, isBlank, isPresent,} from '../helpers/helpers';
import Layout from '../Layout';
import {BigBtnEmotion, BtnOutline, BtnPrimary, Header,} from '../UI/ShareContent';
import Gif from './Gifs';

export const getAndSetImageHeight = (file, setImageHeight, callback) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    setImageHeight(img.naturalHeight);
    callback(true);
  };
};

const MemeSelection = ({
                         data,
                         setData,
                         saveDataToDb,
                         steps,
                         service,
                         isCustomGif,
                         setIsCustomGif,
                         draft,
                       }) => {
  const {emotion, api_giphy_key, response} = data;
  const navigate = useNavigate();
  const {isLoading, error} = service;
  const [gifUrl, setGifUrl] = useState(response.attributes.gif || {});
  const [selectedGifIndex, setSelectedGifIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingError, setUploadingError] = useState('');
  const [isDraft, setIsDraft] = useState(draft);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size <= 100 * 1024 * 1024) {
      // 100 MB in bytes
      if (file.type === 'image/gif' || file.type.startsWith('video/')) {
        const callback = (success) => {
          if (success) setSelectedFile(file);
        };
        getAndSetImageHeight(file, setImageHeight, callback);
      } else {
        setSelectedFile(null);
        alert('Please select a GIF or Video file.');
      }
    } else {
      setSelectedFile(null);
      alert('File size exceeds the limit of 100 MB.');
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveDraft = () => {
    const dataDraft = {gif: gifUrl, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  useEffect(() => {
    if (gifUrl !== response.attributes.gif && isDraft) {
      setIsDraft(false);
    }
  }, [gifUrl]);

  const handlingOnClickSkip = () => {
    steps.push('emotion-intensity');
    saveDataToDb(steps, {gif: null, draft: false});
  };

  const chooseGIPHYHandling = () => {
    steps.push('emotion-intensity');
    saveDataToDb(steps, {gif: gifUrl, draft: false});
  };

  const uploadGIPHYHandling = async () => {
    setUploading(true);
    setUploadingError('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('api_key', api_giphy_key);
    // formData.append('username', 'Vibereport');

    try {
      const response = await fetch('https://upload.giphy.com/v1/gifs', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      setGifUrl({
        src: gifUrlWithId(responseData.data.id),
        height: imageHeight * 0.22,
      });
      setIsCustomGif(true);
      setSelectedFile(null);
      setUploading(false);
    } catch (error) {
      setSelectedFile(null);
      setUploading(false);
      setUploadingError(error.message);
    }
  };

  useEffect(() => {
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  }, []);

  useEffect(() => {
    selectedFile && uploadGIPHYHandling();
  }, [selectedFile]);

  const Navigation = () => (
    <div className="d-flex gap-2 d-sm-flex justify-content-sm-evenly justify-content-lg-between justify-content-md-between">
      <div>
        <h4 className="fs-md-6 mt-2 mb-0 text-muted">Share it in your way!</h4>
        <div>
          <BtnOutline
            text="Upload your own meme!"
            onClick={handleButtonClick}
            addClass={"fs-8 fs-sm-5"}
          />
          <input
            type="file"
            accept="image/gif, video/*" // Accepts GIF and any video format
            ref={fileInputRef}
            className="d-none"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="align-content-end">
        <BtnPrimary
          text="Next"
          onClick={chooseGIPHYHandling}
          hidden={isBlank(gifUrl)}
        />
        <BtnPrimary
          text="Skip"
          onClick={handlingOnClickSkip}
          hidden={isPresent(gifUrl)}
        />
      </div>
    </div>
  );

  const Header = () => (
    <div className="d-flex mx-3 pt-1 pt-md-0">
      <div className="d-flex flex-column">
        <h4 className="fs-md-6 opacity-50">You picked:</h4>
        <BigBtnEmotion emotion={emotion} onClick={backHandling}/>
      </div>
    </div>
  );

  if (!!error) return <p>{error.message}</p>;

  return (
      !isLoading && (
          <Layout
              data={data}
              setData={setData}
              saveDataToDb={saveDataToDb}
              steps={steps}
              draft={isDraft}
              handleSaveDraft={handleSaveDraft}
          >
            <div className="container-fluid gif-wrap">
              <Header/>
              <Gif
                  {...{
                    emotion,
                    api_giphy_key,
                    gifUrl,
                    setGifUrl,
                    selectedGifIndex,
                    setSelectedGifIndex,
                    isCustomGif,
                    setIsCustomGif,
                    uploading,
                    uploadingError,
                  }}
              />
              <Navigation/>
            </div>
          </Layout>
      )
  );
};

export default MemeSelection;
