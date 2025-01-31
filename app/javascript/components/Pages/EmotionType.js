import React, { useEffect, useState } from 'react';
import { BigBtnEmotion } from '../UI/ShareContent';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import Layout from '../Layout';
import ToggleEmotionType from '../UI/ToggleEmotionType';
import {
  handleOnClickNext,
  fetchEmotions,
  saveDataEmotion,
} from '../helpers/emotionTypeUtils';


const EmotionType = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const { isLoading, error } = service;
  const { category } = data.emotion;
  const [selectedType, setSelectedType] = useState(category);
  const [emotion, setEmotion] = useState({
    word: data.emotion.word,
    category: data.emotion.category,
  });
  const [emotions, setEmotions] = useState([]);
  const [isDraft, setIsDraft] = useState(draft);

  const dataRequest = {
    emotion: { word: emotion.word, category: emotion.category },
  };

  const handleEmotionType = (type) => {
    setSelectedType(type);
    setEmotion((prevState) => ({ ...prevState, category: type }));
  };

  const handleSaveDraft = () => {
    const { word, category } = emotion;
    const existingEmotion = emotions.find(
      (emotion) =>
        emotion.attributes.word === word &&
        emotion.attributes.category === category
    );
    if (existingEmotion) {
      saveDataToDb(steps, { emotion_id: existingEmotion.id, draft: true });
    } else {
      saveDataEmotion(dataRequest, (word) => {
        saveDataToDb(steps, { emotion_id: word.data.id, draft: true });
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
        <div className="central-element">
          <div className="mt-1 mb-5 text-center">
            <BigBtnEmotion
              showPencil={false}
              emotion={data.emotion}
              selectedType={selectedType}
            />
          </div>
          <ToggleEmotionType
            selectedType={selectedType}
            handleEmotionType={handleEmotionType}
          />
          <div className="mt-3">
            <BlockLowerBtns nextHandling={handlingOnClickNext} />
          </div>
        </div>
      </Layout>
    )
  );
};

export default EmotionType;
