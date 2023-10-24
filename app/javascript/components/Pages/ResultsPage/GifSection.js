import React from "react"
import isEmpty from "ramda/src/isEmpty";
import Tippy from '@tippyjs/react';
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

  return <div className='align-self-center gif-wrap result-page mb-3'>
    <div className='border-none card'>
      <div className='card-body h-auto p-0'>
        <div className="gif-list">
          {squares}
        </div>
      </div>
    </div>
  </div>
}

const GifSection = ({ gifs, nextTimePeriod, isMinUsersResponses }) => {
  const showPreview = !nextTimePeriod && isMinUsersResponses
  if(showPreview) return <PreviewGifSection />

  if(isEmpty(gifs)) return null

  const gifItems = gifs.sort((a, b) => a.image.height - b.image.height).map((gif, index) => {
    return <div className='gif-item result-page' key={index}>
      <Tippy content={<div className={`btn btn-bubbles wb1 not-shadow tippy ${gif.emotion.category}`}>{gif.emotion.word}</div>}>
        <img className='position-relative' src={gif.image.src} alt={`gif ${index}`} />
      </Tippy>
    </div>
  });

  return <div className='align-self-center gif-wrap result-page mb-3'>
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
