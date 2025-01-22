import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";
import ToggleEmotionType from "../UI/ToggleEmotionType";
import {handleOnClickNext, fetchEmotions} from "../helpers/emotionTypeUtils";


const EmotionEntry = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const [selectedType, setSelectedType] = useState(data.emotion?.category || 'positive');
  const [emotion, setEmotion] = useState({word: data.emotion?.word || '', category: data.emotion?.category || 'positive'});
  const [emotions, setEmotions] = useState([]);

  const handleEmotionType = (type) =>{
    setSelectedType(type)
    setEmotion(prevState => ({...prevState, category: type}));
  }

  const onChangeEmotion = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    const trimStartValue = value.trimStart();
    setEmotion({ ...emotion, [name]: trimStartValue });
  };

  const handlingOnClickNext = () => {
    const trimmedWord = emotion.word.toLowerCase().trim();
    const updatedEmotion = { ...emotion, word: trimmedWord };
    const dataRequest = {
      emotion: {word: updatedEmotion.word, category: updatedEmotion.category}
    }
    handleOnClickNext(updatedEmotion, emotions, steps, saveDataToDb, dataRequest);
  };

  useEffect(() => {
    fetchEmotions(setEmotions);
  }, []);

  if (!!error) return <p>{error.message}</p>

  return !isLoading &&
    <>
      <div className='central-element'>
        <h1 className= 'emotion-entry'>A new one! What’s up?</h1>
        <h4 className="emotion-entry mt-3">What word best describes work, recently?</h4>
        <Form.Control
          className ={`input-${selectedType} email_field input-new-word mb-80`}
          type="text" maxLength={15}
          autoComplete="off"
          placeholder="Add a new word"
          name="word"
          value = {emotion.word || ''}
          onChange={onChangeEmotion}
        />
        <ToggleEmotionType selectedType={selectedType} handleEmotionType={handleEmotionType}/>
      </div>
      <BlockLowerBtns nextHandling={handlingOnClickNext} disabled={emotion.word.length < 2}/>
      <CornerElements data={data}
                      setData={setData}
                      saveDataToDb={saveDataToDb}
                      steps={steps}
                      draft={draft}/>
    </>
};

export default EmotionEntry;