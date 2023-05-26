import React from 'react';
import {BigBtnEmotion, Wrapper} from "../UI/ShareContent";
import PoweredBy from '../../../assets/images/PoweredBy.svg';
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";

const SelectedGiphyFollow = ({data, setData, saveDataToDb, steps, service, isCustomGif}) => {
  const {isLoading, error} = service
  const gif_url = data.response.attributes.gif_url

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
    saveDataToDb( steps, {})
  }


  if (!!error) return <p>{error.message}</p>

  return !isLoading &&
    <Wrapper>
      <div className='central-element'>
        {
          isCustomGif ?
            <h1 className='mt-151' >A new one... Nice!</h1> :
            <h1>Excellent choice!</h1>
        }
        <h2 className='muted mt-2 mb-2'>You uploaded:</h2>
        <div className='gif d-inline-block text-end'>
          <img src={gif_url} alt='Giphy image' className={`big image-${data.emotion.category} align-top`} />
          <br />
          <img src={PoweredBy} alt='PoweredBy' className={`big image-powered-by align-top`}/>
        </div>
        <div className='mt-2 text-center'>
          <BigBtnEmotion showPencil={false} emotion={data.emotion} />
        </div>
      </div>
      <BlockLowerBtns nextHandling={ handlingOnClickNext } />
      <CornerElements data = { data }
                      setData = { setData }
                      percentCompletion = { 20 } />
    </Wrapper>
};

export default SelectedGiphyFollow;