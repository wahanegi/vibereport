import React from "react"
import GifItem from "./GifItem";
import {sortImagesByHeight} from "../../helpers/helpers";

const GifList = ({ gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif }) => {

  const gifItems = sortImagesByHeight(gifs).map(image => {
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
        <div className='gif'>
          <img src={gifUrl} alt='Giphy image' className={`big`} />
        </div>:
        <div className="gif-list">{gifItems}</div>
    }
  </div>
};

export default GifList
