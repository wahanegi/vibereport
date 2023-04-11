import React, {Fragment, useEffect, useState} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";
import {capitalizeFirstLetter, isBlank} from "../helpers/helpers";
import ButtonEmotion from "../UI/ButtonEmotion";
import PoweredBy from '../../../assets/images/PoweredBy.svg';

const IntenseLine = ({rating, setRating, comment, setComment, generateStyles, category, isBlankGif}) => {
  const [isTextareaActive, setIsTextareaActive] = useState(false);
  const handleRatingClick = (value) => setRating(value);
  const handleCommentClick = (event) => {
    setComment(event.target.value);
    setIsTextareaActive(true);
  };
  const handleCommentFocus = (event) => {
    if (!isTextareaActive) {
      event.target.placeholder = '';
      setIsTextareaActive(true);
    }
  };
  return (
  <div className="rating-comment-container">
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
          <label className="comment-label">
            <textarea
              className="form-control"
              placeholder={isBlankGif ? "What's going on?" : "Help us better understand why you chose this meme and intensity level!"}
              defaultValue={comment}
              onChange={handleCommentClick}
              maxLength={700}
              onFocus={handleCommentFocus}
            />
          </label>
        )}
      </div>
    </form>
  </div>
  );
  };
  
const EmotionIntensity = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { word, category } = data.emotion
  const { gif_url } = data.response.attributes
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const isBlankGif = isBlank(gif_url)
  
useEffect(() => {
  if (data.response.attributes.rating) {
    setRating(data.response.attributes.rating);
  }
  if (data.response.attributes.comment !== null) {
    setComment(data.response.attributes.comment);
  } else {
    setComment('');
  }
}, [data]);
  
  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {rating: rating, comment: comment})
  }

  const EmotionGif = () => <div className='d-flex flex-column align-items-center'>
    <div className='gif gif-productivity'>
      <img src={gif_url} alt='Giphy image' className={`small image-${category}`} />
      <br />
        <img src={PoweredBy} alt='PoweredBy' className={`small-image-powered-by`}/>
    </div>
    <div className='emotion-small'>
     <ButtonEmotion category={category}>{word}</ButtonEmotion> 
    </div>    
  </div>

  const EmotionSection = () => 
  <Fragment>
    {isBlank(gif_url) ? (
      <Fragment>
        <h1 className="mb-2">"{capitalizeFirstLetter(word)}" week? Most excellent!</h1>
        <h2>Select how intense the feeling was</h2>
        <br/>
      </Fragment>
    ) : (
      <Fragment>
        <EmotionGif />
        <h2>Select how intense the feeling was</h2>
      </Fragment>
    )}
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

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <EmotionSection />
      <IntenseLine
              rating={rating} 
              setRating={setRating} 
              comment={comment} 
              setComment={setComment} 
              generateStyles={generateStyles}
              category={category}
              isBlankGif={isBlankGif}
       />
    </div>
    <Footer nextClick={handlingOnClickNext} disabled={rating === null}/>
  </Wrapper>
};

export default EmotionIntensity;
