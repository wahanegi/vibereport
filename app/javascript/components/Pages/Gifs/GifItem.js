import React, {Fragment} from "react"

const GifItem = ({ gif, index, selectedGifIndex, setSelectedGifIndex, setGifUrl }) => {

  const onGifSelect = () => {
    setGifUrl(gif.images.original.url)
    setSelectedGifIndex(index)
  }

  return <Fragment>
    <div className={selectedGifIndex === index ? 'gif-clicked' : 'gif-item'}>
      <img src={gif.images.downsized.url} onClick={() => onGifSelect(gif)} />
    </div>
  </Fragment>
};


export default GifItem