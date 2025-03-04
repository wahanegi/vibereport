import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {fetchEmotions, handleOnClickNext} from '../helpers/emotionTypeUtils';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import ToggleEmotionType from '../UI/ToggleEmotionType';


const EmotionEntry = ({
                        data,
                        setData,
                        saveDataToDb,
                        steps,
                        service,
                        draft,
                      }) => {
  const {isLoading, error} = service;
  const [selectedType, setSelectedType] = useState(
    data.emotion?.category || 'positive'
  );
  const [emotion, setEmotion] = useState({
    word: data.emotion?.word || '',
    category: data.emotion?.category || 'positive',
  });
  const [emotions, setEmotions] = useState([]);

  const handleEmotionType = (type) => {
    setSelectedType(type);
    setEmotion((prevState) => ({...prevState, category: type}));
  };

  const onChangeEmotion = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    const trimStartValue = value.trimStart();
    setEmotion({...emotion, [name]: trimStartValue});
  };

  const handlingOnClickNext = () => {
    const trimmedWord = emotion.word.toLowerCase().trim();
    const updatedEmotion = {...emotion, word: trimmedWord};
    const dataRequest = {
      emotion: {word: updatedEmotion.word, category: updatedEmotion.category},
    };
    handleOnClickNext(
      updatedEmotion,
      emotions,
      steps,
      saveDataToDb,
      dataRequest
    );
  };

  useEffect(() => {
    fetchEmotions(setEmotions);
  }, []);

  const emotionClasses = {
    positive: 'bg-green-200 bg-green-200-focus text-placeholder-green-700 text-green-700 text-focus-green-700',
    negative: 'bg-apricot bg-apricot-focus text-placeholder-orange-700 text-orange-700 text-focus-orange-700',
  };

  if (!!error) return <p>{error.message}</p>;

  return (
    !isLoading && (
      <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={draft}
      >
        <div className="container-fluid">
          <div className="row flex-column justify-content-center">
            <div className="col-12 text-center mx-auto">
              <h1 className="fs-md-1 mb-3">A new one! What’s up?</h1>
              <h2 className="fs-md-4 mb-1 text-gray-600">
                What word best describes work, recently?
              </h2>
            </div>
            <div className="col-12 col-lg-6 col-md-8 mx-auto">
              <Form.Control 
                className={`${emotionClasses[selectedType]} input-new-word fs-xxl-2 fs-md-4 fs-sm-5 fs-5 rounded-4 mb-5 mb-md-8 fw-bold border-royal-blue`}
                type="text"
                maxLength={15}
                autoComplete="off"
                placeholder="Add a new word"
                name="word"
                value={emotion.word || ''}
                onChange={onChangeEmotion}
              />
            </div>
            <div className="col-12 col-md-6 mb-4 mx-auto">
              <ToggleEmotionType
                selectedType={selectedType}
                handleEmotionType={handleEmotionType}
              />
            </div>
          </div>
          <div className="mt-4">
            <BlockLowerBtns
              nextHandling={handlingOnClickNext}
              disabled={emotion.word.length < 2}
            />
          </div>
        </div>
      </Layout>
    )
  );
};

export default EmotionEntry;
