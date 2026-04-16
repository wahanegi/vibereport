import React, {Fragment} from "react"
import { REGEX } from '../../helpers/consts'

const GifItem = ({ gif, index, selectedGifIndex, setSelectedGifIndex, setGifUrl, category }) => {
  const gif_url = gif.src_preview || gif.src
  const isVideo = REGEX.videoExtension.test(gif_url || '');

  const onGifSelect = () => {
    setGifUrl({ src: gif_url, height: gif.height });
    setSelectedGifIndex(index);

  }
  return <Fragment>
    <div className={selectedGifIndex === index ? `gif-clicked-${category}` : 'gif-item'}>
      {
        isVideo ? (
        <video autoPlay loop muted playsInline
               src={gif_url}
               onClick={onGifSelect}
               aria-label={`gif ${category}`} />
      ) : (
      <img src={gif_url} onClick={onGifSelect} alt={`gif ${category}`} />
      )}
    </div>
  </Fragment>
};


export default GifItem
