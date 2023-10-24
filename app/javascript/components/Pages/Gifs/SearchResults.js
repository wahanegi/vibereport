import React, {Fragment} from "react"
import {Link} from "react-router-dom";
import {GIPHY_INSTRUCTION_URL} from "../../helpers/consts";
import isEmpty from "ramda/src/isEmpty";
import GifList from "./GifList";
import {isBlank, isEmptyStr, isNotEmptyStr} from "../../helpers/helpers";
import ProgressBar from "../../UI/ProgressBar";

const WrapGifMessage = ({children}) =>
  <div className='card-body d-flex align-items-center justify-content-center'>
    {children}
  </div>

const SearchResults = ({ gifs, gifUrl, setGifUrl, selectedGifIndex, uploading, uploadingError,
                         setSelectedGifIndex, category, isCustomGif, apiGiphyKey, }) => {

  if (isBlank(apiGiphyKey)) return <h1 className='text-white m-3'>We noticed that you didn't add the GIPHY api token for displaying gifs here. Please follow this&nbsp;
    <Link to={GIPHY_INSTRUCTION_URL} target="_blank" rel="noopener noreferrer">
      instruction
    </Link>
    &nbsp;and add the received token to Heroku Config Vars.
  </h1>

  if (isEmpty(gifs) && isEmptyStr(uploadingError)) return <WrapGifMessage>
    <div className='text-white h1'>No results</div>
  </WrapGifMessage>

  if (uploading) return <WrapGifMessage>
    <ProgressBar text='Uploading...' />
  </WrapGifMessage>

  if (isNotEmptyStr(uploadingError)) return <WrapGifMessage>
    <div className='text-white h4'>Error: {uploadingError}</div>
  </WrapGifMessage>

  return <Fragment>
    <GifList {...{gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif}} />
  </Fragment>
}

export default SearchResults
