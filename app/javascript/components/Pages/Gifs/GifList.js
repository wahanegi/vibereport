import React, {useState} from "react"
import GifItem from "./GifItem";

const GifList = ({ gifs, setGifUrl, selectedGifIndex, setSelectedGifIndex, category }) => {

  const gifItems = gifs.map(image => {
    return <GifItem key={image.id}
                    gif={image}
                    selectedGifIndex={selectedGifIndex}
                    setSelectedGifIndex={setSelectedGifIndex}
                    setGifUrl={setGifUrl}
                    category={category}
                    index={image.id} />
  });

  return <div className='card-body card-scroll'>
    <div className="gif-list">{gifItems}</div>
  </div>
};

export default GifList
