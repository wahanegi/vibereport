import React from "react";
import axios from "axios";

export const createCsrfToken = () => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

export const createResponse = async (emotion_id, time_period_id, navigate, step) => {
  createCsrfToken()
  await axios.post('/api/v1/responses', {emotion_id, time_period_id, step})
    .then(resp => {
      navigate(`/responses/${resp.data.data.id}`)
    })
    .catch(resp => {console.log(resp)})
}

export const updateResponse = async (response, setResponse) => {
  createCsrfToken()
  console.log("before resp=", response);
  await axios.patch(`/api/v1/responses/${response.id}`, response.attributes)
    .then(resp => {
      console.log("after resp=", resp);
      setResponse({...resp.data.data})
    })
    .catch(resp => {console.log(resp)})
}