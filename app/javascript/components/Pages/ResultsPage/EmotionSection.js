import React from "react";
import { animated, useSpring } from "@react-spring/web";
import { EMOTION_COL_NUMBERS, MIN_USERS_RESPONSES } from "../../helpers/consts";
import { splitArray } from "../../helpers/helpers";
import { filter } from "ramda";

const AnimatedEmotion = ({ word, category, addBlur = false, count = 1 }) => {
  const shift = Math.round(Math.random() * 10) / 10

  const animatedStyles = {
    marginTop: `${shift * 40}px`,
    fontSize: `${shift + 0.4}rem`,
    filter: addBlur ? 'blur(8px)' : 'none',
  }

  return (
    <div className="word fw-bold text-steel-blue" style={animatedStyles}>{word}</div>
  );
};

const PreviewEmotionSection = ({ data }) => {
  const filteredData = data.data.filter(item => item.attributes.category === "positive" || item.attributes.category === "negative");
  const splitEmotions = splitArray(filteredData, EMOTION_COL_NUMBERS)
  const rowsNumber = splitEmotions.length

  return <div className='mb-2' style={{ marginTop: 60 }}>
    <table className="table table-borderless d-flex justify-content-center" style={{ height: `${rowsNumber * 80}px` }}>
      <tbody>
        {
          splitEmotions.map((emotions, index) =>
            <tr key={index}>
              {
                emotions.map((emotion, index) =>
                  <td key={index}>
                    <AnimatedEmotion word={emotion.attributes.word} category={emotion.attributes.category} addBlur={true} />
                  </td>)
              }
            </tr>
          )
        }
      </tbody>
    </table>
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

const EmotionSection = ({ emotions, nextTimePeriod, data, isMinUsersResponses }) => {
  const filteredEmotions = filterEmotions(emotions)
  const splitEmotions = splitArray(filteredEmotions, EMOTION_COL_NUMBERS)
  const rowsNumber = splitEmotions.length

  if (!nextTimePeriod && isMinUsersResponses) return <PreviewEmotionSection data={data} />

  return <div className='mb-2' style={{ marginTop: 60 }}>
    <table className="table table-borderless d-flex justify-content-center" style={{ height: `${rowsNumber * 80}px` }}>
      <tbody>
        {
          splitEmotions.map((emotions, index) =>
            <tr key={index}>
              {
                emotions.map((emotion, index) =>
                  <td key={index}>
                    <AnimatedEmotion word={emotion.word} category={emotion.category} count={emotion.count} />
                  </td>)
              }
            </tr>
          )
        }
      </tbody>
    </table>
  </div>

}
export default EmotionSection
