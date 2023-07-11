import { apiRequest } from "../requests/axios_requests";
import axios from "axios";

export const handleOnClickNext = (emotion, emotions, steps, saveDataToDb, dataRequest) => {
  const { word, category } = emotion;
  const existingEmotion = emotions.find(
    (emotion) =>
      emotion.attributes.word === word &&
      emotion.attributes.category === category
  );
  if (existingEmotion) {
    steps.push("meme-selection");
    saveDataToDb(steps, { emotion_id: existingEmotion.id, draft: false });
  } else {
    saveDataEmotion(dataRequest, (word) => {
      steps.push("meme-selection");
      saveDataToDb(steps, { emotion_id: word.data.id, draft: false });
    });
  }
};

export const saveDataEmotion = (dataRequest, dataFromServer) => {
  apiRequest("POST", dataRequest, dataFromServer, () => {}, "/api/v1/emotions")
    .then((response) => {});
};

export const fetchEmotions = (setEmotions) => {
  axios.get("/api/v1/all_emotions").then((res) => {
    setEmotions(res.data.data);
  });
};
