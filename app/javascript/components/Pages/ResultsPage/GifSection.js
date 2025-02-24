import Tippy from '@tippyjs/react';
import isEmpty from "ramda/src/isEmpty";
import React from "react"
import PoweredBy from "../../../../assets/images/PoweredBy.svg";

const PreviewGifSection = () => {
  return (<div className='container blur-effect'>
    <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1">
      {Array(12).fill(0).map((_, index) => (
        <div className='col align-items-center p-1' key={index}>
          <div className="square w-100"></div>
        </div>
      ))}
    </div>
  </div>)
}

const GifSection = ({gifs, nextTimePeriod, isMinUsersResponses}) => {
  const showPreview = !nextTimePeriod && isMinUsersResponses

  if (showPreview) return <PreviewGifSection/>

  if (isEmpty(gifs)) return null

  const gifItems = gifs.sort((a, b) => a.image.height - b.image.height).map((gif, index) => {
    return <div className='col align-items-center p-1 gif-container' key={index}>
      <Tippy content={<div
        className={`btn btn-bubbles wb1 not-shadow tippy ${gif.emotion.category}`}>{gif.emotion.word}</div>}>
        <img src={gif.image.src} className="img-fluid" alt={`gif ${index}`}/>
      </Tippy>
    </div>
  });

  return <>
    <div className='container'>
      <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1">
        {gifItems}
      </div>
    </div>
    <img src={PoweredBy} alt='PoweredBy' className="big image-powered-by align-top"/>
  </>
};

export default GifSection
