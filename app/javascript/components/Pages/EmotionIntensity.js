import React, {Fragment, useEffect, useState} from 'react';
import PoweredBy from '../../../assets/images/PoweredBy.svg';
import {EMOTION_COLORS, MAX_CHAR_LIMIT} from '../helpers/consts';
import {capitalizeFirstLetter, isBlank} from '../helpers/helpers';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import ButtonEmotion from '../UI/ButtonEmotion';

const IntenseLine = ({
                       rating, setRating, comment, setComment, generateStyles, category, isBlankGif,
                     }) => {
  const handleRatingClick = (value) => setRating(value);
  const handleCommentClick = (event) => {
    setComment(event.target.value);
  };

  return (
    <div className="emotion-intensity">
      <form>
        <div className="">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="d-inline-block fs-1 text-center text-black rating-label"
              style={generateStyles(value, rating === value, category)}
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => handleRatingClick(value)}
                className="d-none"
              />
              {value}
            </label>))}
        </div>

        {rating && (
          <div className='py-1 mx-auto wrap-textarea'>
            <label className={"comment-label w-100 h-100"}>
              <textarea
                className="w-100 h-100 p-2 rounded-5 shadow-none resize-none"
                placeholder={isBlankGif ? "What's going on?" : "Help us better understand why you chose this meme and intensity level!"}
                defaultValue={comment}
                onChange={handleCommentClick}
                maxLength={MAX_CHAR_LIMIT}
              />
            </label>
          </div>
        )}
      </form>
    </div>);
};

const EmotionIntensity = ({
                            data, setData, saveDataToDb, steps, service, draft,
                          }) => {
  const {isLoading, error} = service;
  const {word, category} = data.emotion;
  const gif_url = data.response.attributes.gif?.src;
  const [rating, setRating] = useState(data.response.attributes.rating || null);
  const [comment, setComment] = useState(data.response.attributes.comment || '');
  const isBlankGif = isBlank(gif_url);
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = {rating, comment, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  useEffect(() => {
    const dataComment = data.response.attributes.comment;
    const dataRating = data.response.attributes.rating;
    if ((comment !== dataComment || rating !== dataRating) && isDraft) {
      setIsDraft(false);
    }
  }, [comment, rating]);

  const handlingOnClickNext = () => {
    steps.push('productivity-check');
    saveDataToDb(steps, {rating, comment, draft: false});
  };

  const EmotionGif = () => (
    <div className="d-flex flex-column align-items-center">
      <div className="gif d-inline-block text-end">
        <img
          src={gif_url}
          alt="Giphy image"
          className={`small image-${category} align-top`}
        />
        <br/>
        <img
          src={PoweredBy}
          alt="PoweredBy"
          className={`small-image-powered-by align-top`}
        />
      </div>
      <div className="mb-2">
        <ButtonEmotion category={category}>{word}</ButtonEmotion>
      </div>
    </div>
  );

  const EmotionSection = () => (<Fragment>
    {isBlank(gif_url) ? (<Fragment>
      <h1 className="mb-2">
        “{capitalizeFirstLetter(word)}” — Most excellent!
      </h1>
      <h2 className="text-black mb-3 fs-2">Select how intense the feeling is</h2>
      <br/>
    </Fragment>) : (<Fragment>
      <EmotionGif/>
      <h2 className="text-black mb-3 fs-2">Select how intense the feeling is</h2>
    </Fragment>)}
  </Fragment>);

  const generateStyles = (value, selected, category) => {
    let backgroundColor, borderColor;

    switch (category) {
      case 'negative':
        backgroundColor = EMOTION_COLORS.negative[value] || 'transparent';
        borderColor = '#5689EB';
        break;
      case 'positive':
        backgroundColor = EMOTION_COLORS.positive[value] || 'transparent';
        borderColor = '#5689EB';
        break;
      default:
        backgroundColor = 'transparent';
        borderColor = '#000000';
    }

    return {
      backgroundColor: backgroundColor,
      borderRadius: value === 5 ? '0 29px 29px 0' : value === 1 ? '29px 0 0 29px' : 'none',
      border: selected ? `6px solid ${borderColor}` : `1.15px solid #000000`,
    };
  };

  if (!!error) return <p>{error.message}</p>;

  return (!isLoading && (<Layout
    data={data}
    setData={setData}
    saveDataToDb={saveDataToDb}
    steps={steps}
    draft={isDraft}
    handleSaveDraft={handleSaveDraft}
  >
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <EmotionSection/>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-12">
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
      </div>
      <div className='max-width-emotion-intensity mx-auto'>
        <BlockLowerBtns
          nextHandling={handlingOnClickNext}
          disabled={isBlank(rating)}
        />
      </div>
    </div>
  </Layout>));
};

export default EmotionIntensity;
