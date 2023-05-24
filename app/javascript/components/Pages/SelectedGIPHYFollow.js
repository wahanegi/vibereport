import React from 'react';
import {BigBtnEmotion, Footer, Header, Wrapper} from "../UI/ShareContent";
import PoweredBy from '../../../assets/images/PoweredBy.svg';

const SelectedGiphyFollow = ({data, setData, saveDataToDb, steps, service, isCustomGif, draft}) => {
  const {isLoading, error} = service
  const gif_url = data.response.attributes.gif_url

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
    saveDataToDb( steps, {draft: false})
  }


  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header saveDataToDb={saveDataToDb} steps={steps} draft={draft}/>
    <div className='central-element'>
      {
        isCustomGif ?
          <h1>A new one... Nice!</h1> :
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
    <Footer nextClick={handlingOnClickNext} />
  </Wrapper>
};

export default SelectedGiphyFollow;