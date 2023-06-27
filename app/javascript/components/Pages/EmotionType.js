import React, {useState} from 'react';
import {BigBtnEmotion, Wrapper} from "../UI/ShareContent";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";
import iconNegative from "../../../assets/images/icon_negative.svg";
import iconPositive from "../../../assets/images/icon_positive.svg";
import {apiRequest} from "../requests/axios_requests";

const EmotionType = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const {category} = data.emotion
  const [selectedType, setSelectedType] = useState(category);
  const [emotion, setEmotion] = useState({ word: data.emotion.word, category: data.emotion.category });
  const dataRequest = {
    emotion: {word: emotion.word, category: emotion.category}
  }
  const handleEmotionType = (type) =>{
    setSelectedType(type)
    setEmotion(prevState => ({...prevState, category: type}));
  }

  const getTypeClass = (selectedType) => {
    switch (selectedType) {
      case 'positive':
        return "positive";
      case 'negative':
        return "negative";
      default:
        return "";
    }
  };

  const handleSaveDraft = () => {
    const dataFromServer = (word) => {
      saveDataToDb(steps, {emotion_id: word.data.id, draft: false})
    }
    saveDataEmotion(dataFromServer)
    saveDataToDb(steps, {draft: false});
  }

  const handlingOnClickNext = () => {
      const dataFromServer = (word) => {
        steps.push('meme-selection');
        saveDataToDb(steps, {emotion_id: word.data.id, draft: false});
      };
      saveDataEmotion(dataFromServer);
  };

  const saveDataEmotion = (dataFromServer) => {
    apiRequest("POST", dataRequest, dataFromServer, ()=>{}, "/api/v1/emotions").then(response => {
    });
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading &&
    <Wrapper>
      <div className='central-element'>
        <div className= 'mt-123 mb-80 text-center'>
          <BigBtnEmotion showPencil={false} emotion={data.emotion} addClass={getTypeClass(selectedType)} />
        </div>
        <div>
          <h4>How do you feel about this word?</h4>
          <div className="btn-group wrap-toggle" role="group" aria-label="Basic radio toggle button group">
            <input
              type="radio"
              className={`btn-check toggle-negative-check ${getTypeClass(selectedType, 'negative')}`}
              id="negative"
              autoComplete="off"
              checked={selectedType === 'negative'}
              onChange={() => handleEmotionType('negative')}
            />
            <label className="btn toggle-category toggle-negative" htmlFor="negative">
              <div className="wrap-icon d-flex flex-column align-items-center mt-1">
                <img className="icon-negative" src={iconNegative} alt={"negative"}/>
                <span>Negative</span>
              </div>
            </label>

            <input
              type="radio"
              className={`btn-check toggle-positive-check ${getTypeClass(selectedType, 'positive')}`}
              id="positive"
              autoComplete="off"
              checked={selectedType === 'positive'}
              onChange={() => handleEmotionType('positive')}
            />
            <label className="btn toggle-category toggle-positive" htmlFor="positive">
              <div className="wrap-icon d-flex flex-column align-items-center mt-1">
                <img className="icon-positive" src={iconPositive} alt={"positive"}/>
                <span>Positive</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      <BlockLowerBtns nextHandling={ handlingOnClickNext } />
      <CornerElements data = { data }
                      setData = { setData }
                      saveDataToDb={saveDataToDb}
                      steps={steps}
                      draft={draft}
                      handleSaveDraft={handleSaveDraft}/>
    </Wrapper>
};

export default EmotionType;