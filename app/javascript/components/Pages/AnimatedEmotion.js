import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import {EMOTION_COLORS} from "../helpers/consts";

const AnimatedEmotion = ({word, category}) => {
  const springProps = useSpring({
    from: { fontSize: '1.5rem', opacity: 0.5 },
    to: async (next) => {
      while (true) {
        await next({ fontSize: '2rem', opacity: 1 });
        await next({ fontSize: '1.5rem', opacity: 0.5 });
      }
    },
    config: { duration: 4000 },
  });

  return (
    <div
      style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#f6f6f6',
        padding: '10px',
        width: '80%',
        height: '100%',
        willChange: 'transform, opacity',
        color: EMOTION_COLORS[`${category}`][5]
      }}
    >
      <animated.span style={springProps}>{word}</animated.span>
    </div>
  );
};

export default AnimatedEmotion;
