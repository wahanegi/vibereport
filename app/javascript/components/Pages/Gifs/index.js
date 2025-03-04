import React, {Fragment, useEffect, useState} from "react"
import PoweredBy from '../../../../assets/images/PoweredBy.svg';
import {GIPHY_URL} from "../../helpers/consts";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

function extractGiphyId(url) {
  // Regular expression pattern to match the ID between slashes
  const regex = /\/([^/]+)\/giphy\.gif$/;

  // Use the regex pattern to extract the ID
  const match = url.match(regex);

  // Check if a match was found
  if (match && match[1]) {
    return match[1]; // Return the extracted ID
  } else {
    return null; // Return null if no match was found
  }
}

const Gif = ({
               emotion, api_giphy_key, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex,
               isCustomGif, setIsCustomGif, uploading, uploadingError
             }) => {
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

  useEffect(() => {
    const url = `${GIPHY_URL}search?q=${term?.replace(/\s/g, '+')}&api_key=${apiGiphyKey}`;
    const isGiphyLink = /https:\/\/media\.giphy\.com\/media\/\w+\/giphy\.gif/.test(String(term));
    if (isGiphyLink) {
      loadAndSetGif(term)
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

  const loadAndSetGif = (term) => {
    const id = extractGiphyId(term)
    fetch(`${GIPHY_URL}${id}?api_key=${apiGiphyKey}`)
      .then((response) => response.json())
      .then((data) => {
        setIsCustomGif(true)
        setGifUrl({src: term, height: parseInt(data.data.images.fixed_width.height)})
      })
      .catch((error) => console.error('Error fetching image data:', error));
  }

  const GiphyLogo = () => <img src={PoweredBy} alt='PoweredBy' className="mt-1 big image-powered-by"/>


  return loaded && <Fragment>
    <GiphyLogo/>
    <div className='gif-card rounded-4'>
      <div className='gif-card card pb-1 rounded-4' onKeyDown={handleKeyDown}>
        <SearchBar term={term} setTerm={setTerm} category={category} word={word}/>
        <SearchResults {...{
          gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category,
          isCustomGif, apiGiphyKey, uploading, uploadingError
        }} />
      </div>
    </div>
  </Fragment>
}

export default Gif
