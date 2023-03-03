import React from "react";
import axios from "axios";

export const createCsrfToken = () => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

export const createResponse = async (emotion_id, time_period_id, navigate) => {
  createCsrfToken()
  await axios.post('/api/v1/responses', {emotion_id, time_period_id})
    .then(resp => {
      console.log(resp)
      navigate(`/responses/${resp.data.data.id}`)
    })
    .catch(resp => {console.log(resp)})
}