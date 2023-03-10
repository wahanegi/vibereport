import React from 'react';

const ResponseContext = React.createContext({
  items: {
    time_period_id: null,
    emotion_id: null,
    emotion_word:"",
    user_id: null,
    steps: ""
  },
  updateItems: (item) => {}
});

export default ResponseContext;