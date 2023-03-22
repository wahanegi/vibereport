import React, {useState} from "react"
import GifItem from "./GifItem";

const GifList = ({ gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif }) => {

  const gifItems = gifs.map(image => {
    return <GifItem key={image.id}
                    gif={image}
                    selectedGifIndex={selectedGifIndex}
                    setSelectedGifIndex={setSelectedGifIndex}
                    setGifUrl={setGifUrl}
                    category={category}
                    isCustomGif={isCustomGif}
                    index={image.id} />
  });

  return <div className='card-body card-scroll'>
    {
      isCustomGif ?
        <img src={gifUrl} alt='Giphy image' className='gif-image' /> :
        <div className="gif-list">{gifItems}</div>
    }
  </div>
};

export default GifList
