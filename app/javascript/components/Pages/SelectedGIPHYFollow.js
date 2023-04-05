import React from 'react';
import {BigBtnEmotion, Footer, Header, Wrapper} from "../UI/ShareContent";

const SelectedGiphyFollow = ({data, setData, saveDataToDb, steps, service, isCustomGif}) => {
  const {isLoading, error} = service
  const gif_url = data.response.attributes.gif_url

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
    saveDataToDb( steps, {})
  }


  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      {
        isCustomGif ?
          <h1>A new one... Nice!</h1> :
          <h1>Excellent choice!</h1>
      }
      <h3 className='muted'>You uploaded:</h3>
      <div className='gif'>
        <img src={gif_url} alt='Giphy image' className={`big image-${data.emotion.category}`} />
      </div>
      <div className='mt-2 text-center'>
        <BigBtnEmotion showPencil={false} emotion={data.emotion} />
      </div>
    </div>
    <Footer nextClick={handlingOnClickNext} />
  </Wrapper>
};

export default SelectedGiphyFollow;