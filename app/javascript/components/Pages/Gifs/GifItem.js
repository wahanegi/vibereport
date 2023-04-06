import React, {Fragment} from "react"

const GifItem = ({ gif, index, selectedGifIndex, setSelectedGifIndex, setGifUrl, category }) => {

  const onGifSelect = () => {
    setGifUrl(gif.src)
    setSelectedGifIndex(index)
  }

  return <Fragment>
    <div className={selectedGifIndex === index ? `gif-clicked-${category}` : 'gif-item'}>
      <img src={gif.src}
           onClick={() => onGifSelect(gif)}
           alt={`gif ${category}`} />
    </div>
  </Fragment>
};


export default GifItem