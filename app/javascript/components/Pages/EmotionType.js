import React, {useEffect, useState} from 'react';
import {fetchEmotions, handleOnClickNext, saveDataEmotion,} from '../helpers/emotionTypeUtils';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import {BigBtnEmotion} from '../UI/ShareContent';
import ToggleEmotionType from '../UI/ToggleEmotionType';


const EmotionType = ({
                       data,
                       setData,
                       saveDataToDb,
                       steps,
                       service,
                       draft,
                     }) => {
  const {isLoading, error} = service;
  const {category} = data.emotion;
  const [selectedType, setSelectedType] = useState(category);
  const [emotion, setEmotion] = useState({
    word: data.emotion.word,
    category: data.emotion.category,
  });
  const [emotions, setEmotions] = useState([]);
  const [isDraft, setIsDraft] = useState(draft);

  const dataRequest = {
    emotion: {word: emotion.word, category: emotion.category},
  };

  const handleEmotionType = (type) => {
    setSelectedType(type);
    setEmotion((prevState) => ({...prevState, category: type}));
  };

  const handleSaveDraft = () => {
    const {word, category} = emotion;
    const existingEmotion = emotions.find(
      (emotion) =>
        emotion.attributes.word === word &&
        emotion.attributes.category === category
    );
    if (existingEmotion) {
      saveDataToDb(steps, {emotion_id: existingEmotion.id, draft: true});
    } else {
      saveDataEmotion(dataRequest, (word) => {
        saveDataToDb(steps, {emotion_id: word.data.id, draft: true});
      });
    }
    setIsDraft(true);
  };

  useEffect(() => {
    if (selectedType !== category && isDraft) {
      setIsDraft(false);
    }
  }, [selectedType]);

  const handlingOnClickNext = () => {
    handleOnClickNext(emotion, emotions, steps, saveDataToDb, dataRequest);
  };

  useEffect(() => {
    fetchEmotions(setEmotions);
  }, []);

  if (!!error) return <p>{error.message}</p>;

  return (
    !isLoading && (
      <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={isDraft}
        handleSaveDraft={handleSaveDraft}
      >
        <div className="container pt-10">
          <div className="row justify-content-center mt-1">
            <div className="col-auto">
              <div className="text-center mt-1 mb-9">
                <BigBtnEmotion
                  showPencil={false}
                  emotion={data.emotion}
                  selectedType={selectedType}
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <ToggleEmotionType
                selectedType={selectedType}
                handleEmotionType={handleEmotionType}
              />
            </div>
          </div>
        </div>
        <div className="w-100 mt-4 mx-1 align-self-end">
            <BlockLowerBtns nextHandling={handlingOnClickNext}/>
        </div>
      </Layout>)
  );
};

export default EmotionType;