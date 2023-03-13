import ResponseContext from "./response-context";
import { useReducer } from "react";

const defaultResponseState = {
  items: {}
};

// FOR FUTURE. NOT READY
const responseReducer  = (state, action) => {
  if (action.type === "UPDATE"){

    const updatedItems ={
      ...items,
      time_period_id: state.time_period_id,
      emotion_id: state.emotion_id,
      emotion_word:state.emotion_word,
      user_id: state.user_id,
      steps: state.steps}
    return {

    }
  }
  return defaultResponseState
}
const ResponseProvider = (props) => {
  const [responseState, dispatchResponseAction] = useReducer(
    responseReducer,
    defaultResponseState
  );

  const updateItemsToResponseHandler = (items) => {
    dispatchResponseAction({type: "UPDATE", items: items})
  }
  // const removeItemFromResponseHandler = () => {
  //
  // }

  const responseContext={
    items:{},
    updateItem: updateItemsToResponseHandler,
    // removeItem: removeItemFromResponseHandler
  }
  return (
    <ResponseContext.Provider value={responseContext}>
      {props.children}
    </ResponseContext.Provider>
  );
};

export default ResponseProvider;