import React, {useEffect, useState, Fragment} from "react"
import SearchBar from "./SearchBar";
import GifList from "./GifList";
import {GIPHY_SEARCH_URL} from "../../helpers/consts";

const Gif = ({ emotion, api_giphy_key, setGifUrl, selectedGifIndex, setSelectedGifIndex }) => {
  const [term, setTerm] = useState(emotion.word)
  const {category, word} = emotion
  const [gifs, setGifs] = useState([])
  const [loaded, setLoaded] = useState(false)
  const apiGiphyKey = api_giphy_key

  useEffect(()=> {
    const url = `${GIPHY_SEARCH_URL}=${term?.replace(/\s/g, '+')}&api_key=${apiGiphyKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        setGifs(data.data)
        setLoaded(true)
      })
  }, [term])

 return  loaded && <Fragment>
   <h3 className='text-center mt-1'>Meme it with GIPHY!</h3>
   <div className='card'>
     <SearchBar term={term} setTerm={setTerm} category={category} word={word} />
     <GifList {...{gifs, setGifUrl, selectedGifIndex, setSelectedGifIndex, category}} />
   </div>
  </Fragment>
}

export default Gif
