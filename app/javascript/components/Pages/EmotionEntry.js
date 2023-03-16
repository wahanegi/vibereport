import React, { Fragment, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import Menu from "../UI/Menu";
import iconNegative from "../../../assets/images/icon_negative.svg";
import iconNeutral from "../../../assets/images/icon_neutral.svg";
import iconPositive from "../../../assets/images/icon_positive.svg";
import NavigationButtons from '../UI/NavigationButtons';
import QuestionButton from "../UI/QuestionButton";
import ShoutoutButton from "../UI/ShoutoutButton";

const EmotionEntry = () => {
  const [emotion, setEmotion] = useState({ word: '', category: '' });
  const onChangeEmotion = (e) => {
    setEmotion(Object.assign({}, emotion, {[e.target.name]: e.target.value}))
  }
  const emojis = [
    { name: 'negative', icon: <img className="icon-negative" src={iconNegative} alt={"negative"}/> },
    { name: 'neutral', icon: <img className="icon-neutral" src={iconNeutral} alt={"neutral"}/> },
    { name: 'positive', icon: <img className="icon-positive" src={iconPositive} alt={"positive"}/> },
  ];
  const [hoveredEmoji, setHoveredEmoji] = useState("");
  const handleEmojiClick = (name) => {
    setSelectedEmoji(name);
    setEmotion(prevState => ({...prevState, category: name}));
    setHoveredEmoji("");
  };
  const saveEmotion = () => {
    // createEmotion(emotion, setEmotion)
  };
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const getEmojiClass = (category, name) => {
    if (category === "positive") {
      return "input-positive";
    } else if (category === "negative") {
      return "input-negative";
    } else if (category === "neutral") {
      return "input-neutral";
    } else {
      return "";
    }
  };

  // const EmotionEntry =  ({data, setData, saveDataToDb, steps, service}) => {
  //   const {isLoading, error} = service
  //
  //   const handlingOnClickNext = () => {
  //     steps.push('meme-selection')
  //     saveDataToDb(steps, {})
  //   }
  // }

  //id:"1.1.", step:"emotion-entry"
  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
        <div>
        <div className="convert increased-convert in_left">
          <p>Logo/Brand</p>
          <div className="line1 offset-line1"></div>
          <div className="line2 offset-line2"></div>
        </div>
        <div className="question q-emotion-entry">A new one! What’s up?</div>
        <h3 className="over-input-entry">What word best describes your week?</h3>
        <Form.Control className ={`${getEmojiClass(selectedEmoji)} email_field input_new-word`} size="lg" type="text" placeholder="Add a new word" name="word" value={emotion.word || ''} onChange={onChangeEmotion} />
        <h3 className="under-input-entry">How do you feel about this word?</h3>
        <div className="wrap-emoji">
          {emojis.map((emoji) => (
              <div
                  className={`wrap-icon ${emoji.name}-icon`}
                  key={emoji.name}
                  onClick={() => handleEmojiClick(emoji.name)}
              >
                {emoji.icon} <span>{emoji.name}</span>
              </div>
          ))}
        </div>
        <Button>Go back</Button>
        <NavigationButtons data={data} setData={setData} handlingOnClickNext={handlingOnClickNext} />
        {/*<Button onClick={saveEmotion}>Next</Button>*/}
        <QuestionButton style={{position: 'absolute', right: 47}}/>
        <ShoutoutButton style={{position: 'absolute', left: 45}}/>
        <Menu style={{position: 'absolute', right: 47, top: 62}}>X% complete</Menu>}
      </div>}
  </Fragment>
  );
};

export default EmotionEntry;