import React, {Fragment, useState, useRef} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";
import {capitalizeFirstLetter, isBlank} from "../helpers/helpers";
import ButtonEmotion from "../UI/ButtonEmotion";

const EmotionIntensity = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { word, category } = data.emotion
  const { gif_url } = data.response.attributes
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [commentTouched, setCommentTouched] = useState(false);
  
  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {rating: rating, comment: comment})
  }

  const handleRatingClick = (value) => {
    setRating(value);
  }

  const handleCommentClick = (event) => {
    setComment(event.target.value);
    setCommentTouched(true);
  }
  
  const EmotionGif = () => <div className='d-flex flex-column align-items-center'>
    <div className='gif'>
      <img src={gif_url} alt='Giphy image' className={`image-small-${category}`} />
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

  const generateStyles = (value, selected, category) => {
    let backgroundColor, borderColor;
    switch(category) {
      case "negative":
        backgroundColor = 
          value === 5 ? '#F18C59' : value === 4 ? '#F09D74' :
          value === 3 ? '#F5C1A6' : value === 2 ? '#F7CDB8' :
          value === 1 ? '#FADFD1' : 'transparent';
        borderColor = '#5689EB';
        break;
      case "neutral":
        backgroundColor = 
          value === 5 ? '#5689EB' : value === 4 ? '#78A1EF' :
          value === 3 ? '#9AB8F3' : value === 2 ? '#5689eb73' :
          value === 1 ? '#5689eb40' : 'transparent';
        borderColor = '#F18C59';
        break;
      case "positive":
        backgroundColor = 
          value === 5 ? '#80D197' : value === 4 ? '#A6DFB6' :
          value === 3 ? '#B9E6C6' : value === 2 ? '#CCEDD5' :
          value === 1 ? '#D9F1E0' : 'transparent';
        borderColor = '#5689EB';
        break;
      default:
        backgroundColor = 'transparent';
        borderColor = '#000000';
    }
    
    return {
      backgroundColor: backgroundColor,
      borderRadius: value === 5 ? '0 29px 29px 0' : value === 1 ? '29px 0 0 29px' : 'none',
      border: selected ? `6px solid ${borderColor}` : `1.15px solid #000000`
    }
  }

  const IntenseLine = () => 
  <div className="rating-container">
    <form>
      <div className="form-group">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="rating-label" style={generateStyles(value, rating === value, category)}>
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
      </div>
      <div className="form-group">
        {rating && (
          <label className="comment-container">
            <textarea
              className="form-control"
              placeholder="Help us better understand why you chose this meme and intensity level!"
              defaultValue={comment}
              onBlur={handleCommentClick}
            />
          </label>
        )}
      </div>
    </form>
    
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <EmotionSection />
      <IntenseLine />
    </div>
    <Footer nextClick={handlingOnClickNext} disabled={rating === null}/>
  </Wrapper>
};

export default EmotionIntensity;
