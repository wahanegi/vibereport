import React, {useEffect, useState, Fragment} from "react"
import SearchBar from "./SearchBar";
import GifList from "./GifList";
import {GIPHY_SEARCH_URL} from "../../helpers/consts";
import {Link} from "react-router-dom";

const Gif = ({ emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, isCustomGif, setIsCustomGif }) => {
  const [term, setTerm] = useState(emotion.word)
  const {category, word} = emotion
  const [gifs, setGifs] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [keyDown, setKeyDown] = useState(false)
  const apiGiphyKey = api_giphy_key

  const handleKeyDown = (event) => {
    if (event.keyCode === 8) {
      //Backspace key pressed
      setKeyDown(true)
    } else {
      setKeyDown(false)
    }
  };

  useEffect(()=> {
    const url = `${GIPHY_SEARCH_URL}=${term?.replace(/\s/g, '+')}&api_key=${apiGiphyKey}`;
    const isGiphyLink = /https:\/\/media\.giphy\.com\/media\/\w+\/giphy\.gif/.test(String(term));
    if (isGiphyLink) {
      setIsCustomGif(true)
      setGifUrl(term)
    } else if (!keyDown) {
      setGifUrl(null)
      setIsCustomGif(false)
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          setGifs(data.data)
          setLoaded(true)
        })
    }
  }, [term])

  const GiphyLogo = () => <div className='d-flex justify-content-center align-items-center'>
    <div className='fw-lighter mx-2 light-grey-text mt-1'>POWERED BY</div>
    <div className='fw-bold h2 muted mt-2 mb-0'>GIPHY</div>
  </div>

  const Notice = () =>
    <h1 className='text-white m-3'>We noticed that you didn't add the GIPHY api token for displaying gifs here. Please follow this&nbsp;
    <Link to="https://docs.google.com/document/d/19VOqimOtENKUB0HqaPQ5-6iBx6YdJv90MBDwVQ8ZC_0/edit" target="_blank" rel="noopener noreferrer">
      instruction
    </Link>
      &nbsp;and add the received token to Heroku Config Vars.
  </h1>

 return  loaded && <Fragment>
   <GiphyLogo />
   <div className='gif-card' >
     <div className='gif-card card' onKeyDown={handleKeyDown}>
       <SearchBar term={term} setTerm={setTerm} category={category} word={word} />
       {apiGiphyKey === null ?
         <Notice />:
         <GifList {...{gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif}} />
       }
     </div>
   </div>
  </Fragment>
}

export default Gif
