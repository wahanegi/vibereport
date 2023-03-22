import React, {Fragment} from 'react';
import {BtnBack, BtnNext, LeftPanel, RightPanel} from "../UI/ShareContent";
import {backHandling, capitalizeFirstLetter, isBlank, isEmpty} from "../helpers/helpers";
import ButtonEmotion from "../UI/ButtonEmotion";

const EmotionIntensity = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { word, category } = data.emotion
  const { gif_url } = data.response.attributes
  const { rating } = data.response.attributes

  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {rating: data.response.attributes.rating})
  }
  const handleRatingClick = (value) => {
    saveDataToDb( steps, {rating: value})
  }

  const EmotionGif = () => <div className='d-flex flex-column align-items-center'>
    <div className='gif'>
      <img src={gif_url} alt='Giphy image' className={`image-small-${category}`} />
    </div>
    <ButtonEmotion category={category}>{word}</ButtonEmotion>
  </div>

  const EmotionSection = () => <div style={{marginTop: 140}}>
    {
      isBlank(gif_url) ?
        <h1>"{capitalizeFirstLetter(word)}" week? Most excellent!</h1> :
        <EmotionGif />
    }
    <h3 className='mt-3'>Select how intense the feeling was</h3>
  </div>

  const Footer = () => <div className='d-flex justify-content-between'>
    <BtnBack onClick={backHandling} addClass='m-1' />
    <BtnNext onClick={handlingOnClickNext} addClass='m-1' />
  </div>

  const generateStyles = (value) => {
    return {
      backgroundColor: 
        value === 5 ? '#80D197' : value === 4 ? '#A6DFB6' :
        value === 3 ? '#B9E6C6' : value === 2 ? '#CCEDD5' :
        value === 1 ? '#D9F1E0' : 'transparent',
      borderRadius: value === 5 ? '0 29px 29px 0' : value === 1 ? '29px 0 0 29px' : 'none'
    }
  }

  const IntenseLine = () => 
  <div className="rating-container">
    <form >
      {[1, 2, 3, 4, 5].map((value) => (
        <label key={value} className="rating-label" 
        style={generateStyles(value)}>
          <input
            type="radio"
            name="rating"
            value={value}
            checked={rating === value}
            onChange={() => handleRatingClick(value)}
          />
          {value}{value !== 1}
        </label>
      ))}
    </form>
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <div className="row text-center">
    <LeftPanel />
    <div className='col-8'>
      <div className="d-flex flex-column" style={{height: '90vh'}}>
        <div className="p-2">
          <EmotionSection />
          <IntenseLine />
        </div>
        <div className="mt-auto p-2">
          <Footer />
        </div>
      </div>
    </div>
    <RightPanel />
  </div>
};

export default EmotionIntensity;
