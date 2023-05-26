import React, {Fragment} from "react"
import isEmpty from "ramda/src/isEmpty";
import {sortImagesByHeight} from "../../helpers/helpers";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import PoweredBy from "../../../../assets/images/PoweredBy.svg";

const PreviewGifSection = () => {
  const squareStyle = {
    backgroundColor: '#524F50',
    width: '100%',
    height: '125px',
    filter: 'blur(4px)',
    borderRadius: 6
  };
  const squares = [];

  for (let i = 0; i < 12; i++) {
    squares.push(<div className='gif-item result-page' key={i}>
      <div style={squareStyle} key={i}></div>
    </div>);
  }

  return <div className='align-self-center gif-wrap result-page text-header-position mb-3'>
    <div className='border-none card'>
      <div className='card-body h-auto p-0'>
        <div className="gif-list">
          {squares}
        </div>
      </div>
    </div>
  </div>
}

const GifSection = ({ gifs, nextTimePeriod }) => {
  const showPreview = !nextTimePeriod && gifs.length < MIN_USERS_RESPONSES
  if(showPreview) return <PreviewGifSection />

  if(isEmpty(gifs)) return null

  const gifItems = sortImagesByHeight(gifs).map((gif, index) => {
    return <div className='gif-item result-page' key={index}>
      <img src={gif.src} alt={`gif ${index}`} />
    </div>
  });

  return <div className='align-self-center gif-wrap result-page mb-3 text-header-position'>
    <div className='border-none card'>
      <div className='card-body h-auto p-0'>
        <div className="gif-list">
          {gifItems}
        </div>
      </div>
    </div>
    <img src={PoweredBy} alt='PoweredBy' className={`big image-powered-by align-top`}/>
  </div>
};

export default GifSection
