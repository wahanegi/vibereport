import React from "react"
import isEmpty from "ramda/src/isEmpty";
import {sortImagesByHeight} from "../../helpers/helpers";

const GifSection = ({ gifs }) => {
  if(isEmpty(gifs)) return null

  const gifItems = sortImagesByHeight(gifs).map((gif, index) => {
    return <div className={'gif-item'} key={index}>
      <img src={gif.src} alt={`gif ${index}`} />
    </div>
  });

  return <div className='align-self-center gif-wrap'>
    <div className='gif-result-card'>
      <div className='gif-result-card card'>
        <div className='card-body card-full'>
          <div className="gif-list">{gifItems}</div>
        </div>
      </div>
    </div>
  </div>
};

export default GifSection
