import React from "react";
import {animated, useSpring} from "@react-spring/web";
import {EMOTION_COL_NUMBERS, EMOTION_COLORS} from "../../helpers/consts";
import {splitArray} from "../../helpers/helpers";

const AnimatedEmotion = ({word, category}) => {
  const shift= Math.round(Math.random() * 10)/10
  const minOpacity = (shift - 0.3) > 0 ? (shift - 0.3) : 0.1
  const springProps = useSpring({
    from: { fontSize: `${shift + 0.2}rem`, opacity: minOpacity },
    to: async (next) => {
      while (true) {
        await next({ fontSize: `${shift + 1}rem`, opacity: 1 });
        await next({ fontSize: '1.5rem', opacity: minOpacity });
      }
    },
    config: { duration: 4000 },
  });

  return (
    <div
      style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        willChange: 'transform, opacity',
        color: EMOTION_COLORS[`${category}`][5],
        marginTop: `${shift * 40}px`
      }}
    >
      <animated.span style={springProps}>{word}</animated.span>
    </div>
  );
};

const EmotionSection = ({emotions}) => {
  const splitEmotions = splitArray(emotions, EMOTION_COL_NUMBERS)
  const rowsNumber = splitEmotions.length

  return <table className="table table-borderless d-flex justify-content-center" style={{height: `${rowsNumber * 70}px`}}>
    <tbody>
    {
      splitEmotions.map((emotions, index) =>
        <tr key={index}>
          {
            emotions.map(emotion =>
              <td key={emotion.id}>
                <AnimatedEmotion word={emotion.word} category={emotion.category} />
              </td>
            )
          }
        </tr>
      )
    }
    </tbody>
  </table>
}
export default EmotionSection
