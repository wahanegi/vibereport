import React, {useEffect, useState, Fragment} from "react"
import axios from "axios";
import SearchBar from "./SearchBar";
import GifList from "./GifList";

const Gif = ({ emotion, api_giphy_key, setGifUrl, selectedGifIndex, setSelectedGifIndex }) => {
  const [term, setTerm] = useState(emotion.word)
  const [gifs, setGifs] = useState([])
  const [loaded, setLoaded] = useState(false)
  const apiGiphyKey = api_giphy_key

  useEffect(()=> {
    const url = `http://api.giphy.com/v1/gifs/search?q=${term.replace(/\s/g, '+')}&api_key=${apiGiphyKey}`;
    axios.get(url)
      .then(resp => {
        setGifs( resp.data.data)
        setLoaded(true)
      })
      .catch(resp => console.log(resp))
  }, [term])

 return  loaded && <Fragment>
   <h3 className='text-center mt-5'>Meme it with GIPHY!</h3>
   <div className='card'>
     <SearchBar term={term} setTerm={setTerm}/>
     <GifList {...{gifs, setGifUrl, selectedGifIndex, setSelectedGifIndex}} />
   </div>
  </Fragment>
}

export default Gif
