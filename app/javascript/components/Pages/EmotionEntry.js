import React, { Fragment, useState, useEffect, useRef} from 'react';
import Form from 'react-bootstrap/Form';
import {apiRequest} from "../requests/axios_requests";
import NavigationButtons from '../UI/NavigationButtons';
import Menu from "../UI/Menu";
import iconNegative from "../../../assets/images/icon_negative.svg";
import iconNeutral from "../../../assets/images/icon_neutral.svg";
import iconPositive from "../../../assets/images/icon_positive.svg";
import QuestionButton from "../UI/QuestionButton";
import ShoutoutButton from "../UI/ShoutoutButton";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';

const EmotionEntry = ({data, setData, saveDataToDb, steps, service}) => {

  const {isLoading, error} = service
  const [emotion, setEmotion] = useState({ word: '', category: '' });
  // const [disabled, setDisabled] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [show, setShow] = useState(false);
  // const [isFetchComplete, setIsFetchComplete] = useState(false);

  const onChangeEmotion = (e) => {
    setEmotion({ ...emotion, [e.target.name]: e.target.value.toLowerCase().trim() });
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

  // const Emojis = ({disabled}) =>
  //   <Fragment>
  //     { show && <div>
  //       <h3 className="under-input-entry">How do you feel about this word?</h3>
  //       <div  className={`wrap-emoji ${disabled}`}>
  //         {emojis.map((emoji) => (
  //           <div className={`wrap-icon ${emoji.name}-icon`}
  //                key={emoji.name}
  //                onClick={() => handleEmojiClick(emoji.name)}>
  //             {emoji.icon} <span>{emoji.name}</span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     }
  //   </Fragment>

  const Emojis = ({show}) => {

    console.log(show)
    const nodeRef = useRef(null);
    return (
      <Fragment>
        {!show && (
          <div>

                <h3 className="under-input-entry">How do you feel about this word?</h3>

            <CSSTransition in={!show} timeout={30000} classNames="fade">
            <div className={`wrap-emoji`}>
              {emojis.map((emoji) => (
                <div
                  className={`wrap-icon ${emoji.name}-icon`}
                  key={emoji.name}
                  onClick={() => handleEmojiClick(emoji.name)}
                  ref={nodeRef}
                >
                  {emoji.icon} <span>{emoji.name}</span>
                </div>
              ))}
            </div>
            </CSSTransition>
          </div>
        )}
      </Fragment>
    );
  };

  useEffect(() =>{
    axios.get('/api/v1/all_emotions')
      .then(res => {
        setEmotions(res.data.data)
      })
  }, [])

  // useEffect(() => {
  //   axios.get('/api/v1/all_emotions')
  //     .then(res => {
  //       setEmotions(res.data.data);
  //       setIsFetchComplete(true); // Update fetch completion status
  //     })
  //     .catch(error => {
  //       setIsFetchComplete(true); // Update fetch completion status even in case of error
  //     });
  // }, []);

  // useEffect(() => {
  //   // Update show state only after fetch is complete and emotions array is updated
  //   if (isFetchComplete) {
  //     setShow((emotions.some(e => e.attributes['word'] === emotion.word)) || !emotion.word);
  //   }
  // }, [emotion, emotions, isFetchComplete]);

  useEffect(() => {
    setShow((emotions.some(e => e.attributes['word'] === emotion.word)) || !emotion.word);
  }, [emotion]);

  // useEffect(() =>{
  //   if ((emotions.some(e => e.attributes['word'] === emotion.word)) || !emotion.word) {
  //     setShow(show);
  //   } else {
  //     setShow(!show)
  //   }
  // }, [emotion, emotions])
  // useEffect(() =>{
  //   if (!emotion.word) {
  //     setShow();
  //   } else if (emotions.some(e => e.attributes['word'] === emotion.word)) {
  //     setShow();
  //   } else {
  //    setShow(!show)
  //   }
  // }, [emotion])

  return <Fragment>
    { !!error && <p>{error.message}</p>}
    {!isLoading && !error &&
        <div>
          <div className="convert increased-convert in_left">
            <p>Logo/Brand</p>
            <div className="line1 offset-line1"></div>
            <div className="line2 offset-line2"></div>
          </div>
          <div className="question q-emotion-entry">A new one! What’s up?</div>
          <h3 className="over-input-entry">What word best describes your week?</h3>
          <Form.Control className ={`${getEmojiClass(selectedEmoji)} email_field input_new-word`} size="lg" type="text" placeholder="Add a new word" name="word" value={emotion.word || ''} onChange={onChangeEmotion} />
          <CSSTransition in={!show} timeout={30000} classNames="fade">
            <Emojis show={show}/>
          </CSSTransition>
          <NavigationButtons data={data} setData={setData} handlingOnClickNext={handlingOnClickNext} />
          <QuestionButton style={{position: 'absolute', right: 47}}/>
          <ShoutoutButton style={{position: 'absolute', left: 45}}/>
          <Menu style={{position: 'absolute', right: 47, top: 62}}>X% complete</Menu>
        </div>
    }
  </Fragment>
}
export default EmotionEntry;