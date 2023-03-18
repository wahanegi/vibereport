import React, {useEffect, useState, Fragment} from "react"
import axios from "axios";
import SearchBar from "./SearchBar";
import GifList from "./GifList";

const Gif = ({ emotion, api_giphy_key, setGifUrl, selectedGifIndex, setSelectedGifIndex }) => {
  const [term, setTerm] = useState(emotion.word)
  const category = emotion.category
  const [gifs, setGifs] = useState([])
  const [loaded, setLoaded] = useState(false)
  const apiGiphyKey = api_giphy_key

  useEffect(()=> {
    const url = `//api.giphy.com/v1/gifs/search?q=${term.replace(/\s/g, '+')}&api_key=${apiGiphyKey}`;
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
     <SearchBar term={term} setTerm={setTerm} category={category} />
     <GifList {...{gifs, setGifUrl, selectedGifIndex, setSelectedGifIndex}} />
   </div>
  </Fragment>
}

export default Gif
