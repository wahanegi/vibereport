import React, {useEffect, useState} from 'react';
import {Wrapper} from "../UI/ShareContent";
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

  const dataRequest = {
    emotion: {word: emotion.word, category: emotion.category}
  }

  const handleEmotionType = (type) =>{
    setSelectedType(type)
    setEmotion(prevState => ({...prevState, category: type}));
  }

  const onChangeEmotion = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    const trimmedValue = value.toLowerCase().trim();
    setEmotion({ ...emotion, [name]: trimmedValue });
  };

  const handlingOnClickNext = () => {
    handleOnClickNext(emotion, emotions, steps, saveDataToDb, dataRequest);
  };

  useEffect(() => {
    fetchEmotions(setEmotions);
  }, []);

  if (!!error) return <p>{error.message}</p>

  return !isLoading &&
    <Wrapper>
      <div className='central-element'>
        <h1 className= 'emotion-entry'>A new one! What’s up?</h1>
        <h4 className="emotion-entry mt-3">What word best describes work, recently?</h4>
        <Form.Control
          className ={`input-${selectedType} email_field input-new-word mb-80`}
          type="text" maxLength={15}
          autocomplete="off"
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
    </Wrapper>
};

export default EmotionEntry;