import React, {Fragment} from "react"
import {Link} from "react-router-dom";
import {GIPHY_INSTRUCTION_URL} from "../../helpers/consts";
import isEmpty from "ramda/src/isEmpty";
import GifList from "./GifList";
import {isBlank} from "../../helpers/helpers";
import DotsLoader from "../../UI/DotsLoader";

const SearchResults = ({ gifs, gifUrl, setGifUrl, selectedGifIndex, uploading,
                         setSelectedGifIndex, category, isCustomGif, apiGiphyKey }) => {

  if (isBlank(apiGiphyKey)) return <h1 className='text-white m-3'>We noticed that you didn't add the GIPHY api token for displaying gifs here. Please follow this&nbsp;
    <Link to={GIPHY_INSTRUCTION_URL} target="_blank" rel="noopener noreferrer">
      instruction
    </Link>
    &nbsp;and add the received token to Heroku Config Vars.
  </h1>


  if (isEmpty(gifs)) return <div className='card-body d-flex align-items-center justify-content-center'>
    <div className='text-white h1'>No results</div>
  </div>

  if (!uploading) return <div className='card-body d-flex align-items-center justify-content-center'>
    <DotsLoader className='text-white h1' text='Uploading' />
    {/*<div className='text-white h1'>Uploading...</div>*/}
  </div>

  return <Fragment>
    <GifList {...{gifs, gifUrl, setGifUrl, selectedGifIndex, setSelectedGifIndex, category, isCustomGif}} />
  </Fragment>
}

export default SearchResults
