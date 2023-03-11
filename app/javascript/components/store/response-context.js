import React from 'react';

// FOR FUTURE. NOT READY
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