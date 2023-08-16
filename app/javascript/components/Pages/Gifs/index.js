import React, {useEffect, useState, Fragment} from "react"
import SearchBar from "./SearchBar";
import {GIPHY_SEARCH_URL} from "../../helpers/consts";
import SearchResults from "./SearchResults";
import PoweredBy from '../../../../assets/images/PoweredBy.svg';

const Gif = ({ emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex,
               isCustomGif, setIsCustomGif, uploading, uploadingError }) => {
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
      setGifUrl({src: term})
    } else if (!keyDown) {
      setIsCustomGif(false)
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          const gifs = data.data?.map(gif => ({
            src: gif.images.original.url,
            src_preview: gif.images.preview_gif.url,
            height: parseInt(gif.images.fixed_width.height),
          }));
          setGifs(gifs)
          setLoaded(true)
        })
    }
  }, [term])

  const GiphyLogo = () => <img src={PoweredBy} alt='PoweredBy' className={`mt-1 big image-powered-by`}/>

 return  loaded && <Fragment>
   <GiphyLogo />
   <div className='gif-card' >
     <div className='gif-card card' onKeyDown={handleKeyDown}>
       <SearchBar term={term} setTerm={setTerm} category={category} word={word} />
       <SearchResults {...{gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category,
                           isCustomGif, apiGiphyKey, uploading, uploadingError}} />
     </div>
   </div>
  </Fragment>
}

export default Gif
