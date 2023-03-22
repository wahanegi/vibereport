import React, {useEffect, useState, Fragment} from "react"
import SearchBar from "./SearchBar";
import GifList from "./GifList";
import {GIPHY_SEARCH_URL} from "../../helpers/consts";

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
    <div className='fw-lighter mx-2 light-grey-text'>POWERED BY</div>
    <div className='fw-bold h2 muted mt-2'>GIPHY</div>
  </div>

 return  loaded && <Fragment>
   <GiphyLogo />
   <div className='card' onKeyDown={handleKeyDown}>
     <SearchBar term={term} setTerm={setTerm} category={category} word={word} />
     <GifList {...{gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif}} />
   </div>
  </Fragment>
}

export default Gif
