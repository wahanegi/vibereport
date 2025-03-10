import React from "react";
import { EMOTION_COL_NUMBERS, MIN_USERS_RESPONSES } from "../../helpers/consts";
import { splitArray } from "../../helpers/helpers";

const AnimatedEmotion = ({ word }) => {
  const shift = Math.round(Math.random() * 10) / 10
  const marginTop = shift * 20
  const fontSize = shift + 0.8
  const duration = shift * 7

  const animatedStyles = {
    marginTop: `${marginTop}px`,
    fontSize: `${fontSize}rem`,
    '--duration': `${duration}s`
  }

  return (
    <div className="word fw-bold text-steel-blue" style={animatedStyles}>{word}</div>
  );
};

const PreviewEmotionSection = ({ data }) => {
  const filteredData = data.data.filter(item => item.attributes.category === "positive" || item.attributes.category === "negative");
  const splitEmotions = splitArray(filteredData, EMOTION_COL_NUMBERS)

  return <div className='col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12 blur-effect'>
    {
      splitEmotions.map((emotions, index) =>
        <div className="row row-cols-1 row-cols-lg-4 row-cols-md-3 row-cols-sm-2" key={index}>
          {
            emotions.map((emotion, index) =>
              <div className="col" key={index}>
                <AnimatedEmotion word={emotion.attributes.word} />
              </div>)
          }
        </div>
      )
    }
  </div>
}

const isValidEmotion = (emotion) => emotion.category === "positive" || emotion.category === "negative";

const updateEmotionsCount = (emotions, emotion) => {
  const foundIndex = emotions.findIndex(item => item.id === emotion.id);
  if (foundIndex === -1) {
    emotions.push({ id: emotion.id, category: emotion.category, word: emotion.word, count: 1 });
  } else {
    emotions[foundIndex].count += 1;
  }
  return emotions;
};

const filterEmotions = (emotions) => {
  return emotions.reduce((acc, curr) => {
    if (isValidEmotion(curr)) {
      acc = updateEmotionsCount(acc, curr);
    }
    return acc;
  }, []);
};

const EmotionSection = ({emotions, nextTimePeriod, data, isMinUsersResponses}) => {
    const filteredEmotions = filterEmotions(emotions)

    if (!nextTimePeriod && isMinUsersResponses) return <PreviewEmotionSection data={data}/>

    return <div className='col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12'>
        <div className="row row-cols-1 row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
            {filteredEmotions.map((emotion, index) =>
                <div className="col" key={index}>
                    <AnimatedEmotion word={emotion.word}/>
                </div>)}
        </div>
    </div>
}
export default EmotionSection
