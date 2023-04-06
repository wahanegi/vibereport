import React, {Fragment} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";
import {capitalizeFirstLetter, isBlank} from "../helpers/helpers";
import ButtonEmotion from "../UI/ButtonEmotion";

const EmotionIntensity = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { word, category } = data.emotion
  const { gif_url } = data.response.attributes

  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {})
  }

  const EmotionGif = () => <div className='d-flex flex-column align-items-center'>
    <div className='gif'>
      <img src={gif_url} alt='Giphy image' className={`small image-${category}`} />
    </div>
    <ButtonEmotion category={category}>{word}</ButtonEmotion>
  </div>

  const EmotionSection = () => <Fragment>
    {
      isBlank(gif_url) ?
        <h1>"{capitalizeFirstLetter(word)}" week? Most excellent!</h1> :
        <EmotionGif />
    }
    <h3 className='mt-3'>Select how intense the feeling was</h3>
  </Fragment>

  const IntenseLine = () => <div>
    <span className="under-convert">1</span>
    <span className="under-convert">2</span>
    <span className="under-convert">3</span>
    <span className="under-convert">4</span>
    <span className="under-convert">5</span>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <EmotionSection />
      <IntenseLine />
    </div>
    <Footer nextClick={handlingOnClickNext} />
  </Wrapper>
};

export default EmotionIntensity;
