import React from "react"
import GifItem from "./GifItem";
import {sortImagesByHeight} from "../../helpers/helpers";

const GifList = ({ gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif }) => {

  const gifItems = sortImagesByHeight(gifs).map((image, index) => {
    return <GifItem key={index}
                    gif={image}
                    selectedGifIndex={selectedGifIndex}
                    setSelectedGifIndex={setSelectedGifIndex}
                    setGifUrl={setGifUrl}
                    category={category}
                    isCustomGif={isCustomGif}
                    index={index} />
  });

  return <div className='card-body pt-0 card-scroll'>
    {
      isCustomGif ?
        <div className='gif'>
          <img src={gifUrl.src} alt='Giphy image' className="big" />
        </div>:
        <div className="gif-list">{gifItems}</div>
    }
  </div>
};

export default GifList
