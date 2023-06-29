import React from "react";
import {animated, useSpring} from "@react-spring/web";
import {EMOTION_COL_NUMBERS, EMOTION_COLORS, MIN_USERS_RESPONSES} from "../../helpers/consts";
import {splitArray} from "../../helpers/helpers";

const animatedStyles = (shift, category, addBlur) => {
  return {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    willChange: 'transform, opacity',
    color: EMOTION_COLORS[`${category}`][5],
    marginTop: `${shift * 40}px`,
    filter: `${addBlur? 'blur(8px)' : ''}`
  }
}

const AnimatedEmotion = ({word, category, addBlur = false, count = 1}) => {
  const shift = Math.round(Math.random() * 10)/10
  const minOpacity = (shift - 0.3) > 0 ? (shift - 0.3) : 0.1
  const springProps = useSpring({
    from: { fontSize: `${shift ** 2}rem`, opacity: minOpacity },
    to: async (next) => {
      while (true) {
        await next({ fontSize: `${shift + 0.7}rem`, opacity: 1 });
        await next({ fontSize: `${count < 3 ? '1.8' : '3'}rem`, opacity: minOpacity });
      }
    },
    config: { duration: 4000 },
  });

  return (
    <div style={animatedStyles(shift, category, addBlur)}>
      <animated.span style={springProps}>{word}</animated.span>
    </div>
  );
};

const PreviewEmotionSection = ({data}) => {
  const filteredData = data.data.filter(item => item.attributes.category === "positive" || item.attributes.category === "negative");
  const splitEmotions = splitArray(filteredData, EMOTION_COL_NUMBERS)
  const rowsNumber = splitEmotions.length
  return <div className='mb-2' style={{marginTop: 60}}>
    <table className="table table-borderless d-flex justify-content-center" style={{height: `${rowsNumber * 80}px`}}>
      <tbody>
      {
        splitEmotions.map((emotions, index) =>
          <tr key={index}>
            {
              emotions.map((emotion, index) =>
                <td key={index}>
                  <AnimatedEmotion word={emotion.attributes.word} category={emotion.attributes.category} addBlur={true} />
                </td>
              )
            }
          </tr>
        )
      }
      </tbody>
    </table>
  </div>
}

const EmotionSection = ({emotions, nextTimePeriod, data, isMinUsersResponses}) => {
  const filteredEmotions = emotions.reduce((acc, curr) => {
    if (curr.category === "positive" || curr.category === "negative") {
      const foundIndex = acc.findIndex(item => item.id === curr.id);
      if (foundIndex === -1) {
        acc.push({ id: curr.id, category: curr.category, word: curr.word, count: 1 });
      } else {
        acc[foundIndex].count += 1;
      }
    }
    return acc;
  }, []);
  const splitEmotions = splitArray(filteredEmotions, EMOTION_COL_NUMBERS)
  const rowsNumber = splitEmotions.length

  if(!nextTimePeriod && isMinUsersResponses) return <PreviewEmotionSection data={data} />

  return <div className='mb-2' style={{marginTop: 60}}>
    <table className="table table-borderless d-flex justify-content-center" style={{height: `${rowsNumber * 80}px`}}>
      <tbody>
      {
        splitEmotions.map((emotions, index) =>
          <tr key={index}>
            {
              emotions.map((emotion, index) =>
                <td key={index}>
                  <AnimatedEmotion word={emotion.word} category={emotion.category} count={emotion.count} />
                </td>
              )
            }
          </tr>
        )
      }
      </tbody>
    </table>
  </div>

}
export default EmotionSection
