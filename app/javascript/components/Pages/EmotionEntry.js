import React, {Fragment, useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import {apiRequest} from "../requests/axios_requests";
import {ShoutOutIcon, BtnBack, BtnNext, HelpIcon, Header, Wrapper} from "../UI/ShareContent";
import iconNegative from "../../../assets/images/icon_negative.svg";
import iconNeutral from "../../../assets/images/icon_neutral.svg";
import iconPositive from "../../../assets/images/icon_positive.svg";
import axios from "axios";
import {CSSTransition} from 'react-transition-group';
import {backHandling} from "../helpers/helpers";

const EmotionEntry = ({data, setData, saveDataToDb, steps, service}) => {

  const {isLoading, error} = service
  const [emotion, setEmotion] = useState({ word: data.emotion?.word || '', category: data.emotion?.category || '' });
  const [emotions, setEmotions] = useState([]);
  const [show, setShow] = useState(false);

  const onChangeEmotion = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.toLowerCase().trim();
    setEmotion({ ...emotion, [name]: trimmedValue });

    const existingEmotion = emotions.find(emotion => emotion.attributes.word === trimmedValue);
    if (existingEmotion) {
      setEmotion(prevState => ({ ...prevState, category: existingEmotion.attributes.category }));
    } else {
      setEmotion(prevState => ({ ...prevState, category: null }));
    }
  };

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

  const handlingOnClickNext = () => {
    const dataFromServer = (word) =>{
      steps.push('meme-selection')
      saveDataToDb( steps, {emotion_id: word.data.id} )
    }
    const dataRequest = {
      emotion: {word: emotion.word, category: emotion.category}
    }
    apiRequest("POST", dataRequest, dataFromServer, ()=>{}, "/api/v1/emotions").then(response => {
    });
  };

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const getEmojiClass = (category, name) => {
    switch (category) {
      case 'positive':
        return "input-positive";
      case 'negative':
        return "input-negative";
      case 'neutral':
        return "input-neutral";
      default:
        return "";
    }
  };

  useEffect(() =>{
    axios.get('/api/v1/all_emotions')
      .then(res => {
        setEmotions(res.data.data)
      })
  }, [])

  useEffect(() => {
    if(emotions.some(e => e.attributes.word === emotion.word) || emotions.length === 0 || !emotion.word){
      setShow(false);
    }else {
      setShow(true);
    }
  }, [emotion]);

  const Emojis = () => {
    return (
      <Fragment>
        <div className={`wrap-emoji d-flex justify-content-center align-items-center`}>
          {emojis.map((emoji) => (
            <div
              className={`wrap-icon ${emoji.name}-icon d-flex flex-column align-items-center ${emotion.category === emoji.name ? 'active' : ''}`}
              key={emoji.name}
              onClick={() => handleEmojiClick(emoji.name)}>
              {emoji.icon} <span>{emoji.name.charAt(0).toUpperCase() + emoji.name.slice(1)}</span>
            </div>
          ))}
        </div>
      </Fragment>
    );
  };

  const TextSelectCategory = () => {
    return (
      <Fragment>
        <div>
          <h4 className="emotion-entry-feel">How do you feel about this word?</h4>
        </div>
      </Fragment>
    );
  };

  return <Fragment>
    { !!error && <p>{error.message}</p>}
    {!isLoading && !error &&
      <Wrapper className='position-relative'>
        <Header />
        <div className='central-element'>
          <h1 className= 'emotion-entry'>A new one! What’s up?</h1>
          <h4 className="emotion-entry mt-3">What word best describes your week?</h4>
          <Form.Control className ={`${getEmojiClass(selectedEmoji)} input-${emotion.category} email_field input-new-word`}  type="text" maxLength={15} placeholder="Add a new word" name="word" value={emotion.word || ''} onChange={onChangeEmotion} />
          <CSSTransition in={show} timeout={500} classNames="fade-text" unmountOnExit>
            <TextSelectCategory show={show}/>
          </CSSTransition>
          <CSSTransition in={show} timeout={500} classNames="fade-icon" unmountOnExit>
            <Emojis show={show}/>
          </CSSTransition>
        </div>
        <div className='d-flex justify-content-between m-3'>
          <ShoutOutIcon/>
          <BtnBack onClick={backHandling} addClass='m-1 align-self-center'/>
          <BtnNext data={data} setData={setData} onClick={emotion.category  ? handlingOnClickNext : null} disabled={!emotion.category || emotion.word.length < 2} addClass='m-1 align-self-center'/>
          <HelpIcon/>
        </div>
      </Wrapper>
    }
  </Fragment>
}
export default EmotionEntry;