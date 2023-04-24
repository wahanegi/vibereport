import React from "react";
import axios from "axios";

export const createCsrfToken = () => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

export const createAnswer = async (fun_question_id, response_id, current_user_id, answer_body, setAnswerBody) => {
  createCsrfToken()
  await axios.post('/api/v1/answer_fun_questions', {fun_question_id, response_id, user_id: current_user_id, answer_body})
    .then(resp => {
      setAnswerBody({...resp.data.data})
    })
    .catch(resp => {console.log(resp)})
}

export const createQuestion = async (current_user_id, response_id, question, setQuestion, data, setData) => {
  createCsrfToken()
  await axios.post('/api/v1/fun_questions', {current_user_id, response_id, question_body: question.question_body, setQuestion})
    .then(resp => {
      setQuestion({...resp.data.data})
      // setData(Object.assign({}, data, {users_fun_question: resp.data.data.attributes}))
    })
    .catch(resp => {console.log(resp)})
}

export const updateQuestion = async (question, data, setQuestion, setData, steps) => {
  createCsrfToken()
  await axios.patch(`/api/v1/fun_questions/${question.id}`, question)
    .then(resp => {
      setQuestion({...resp.data.data})
      // setData(Object.assign({}, data, {users_fun_question: resp.data.data.attributes}))
    })
    .catch(resp => {console.log(resp)})
}

export const removeQuestion = async (id, data, setQuestion, setData) => {
  createCsrfToken()
  await axios.delete(`/api/v1/fun_questions/${id}`)
    .then(() => {
      setQuestion({})
      // setData(Object.assign({}, data, {users_fun_question: {}}))
    })
    .catch(resp => {console.log(resp)})
}

//*** method (POST/PATCH)
//*** data = {...} data which send to the controller
//*** setData - this is Hook for saving data of answer of the controller
//***   redirect - the name of the function for navigation in browser. By default is empty
//*** url - route. By default '/api/v1/responses'
export const apiRequest = async ( method, data, setData, redirect = ()=>{}, url = '/api/v1/responses')  =>{
  createCsrfToken()
  switch (method) {
    case "POST":
      await axios.post(url, data)
        .then(response => {
          setData(response.data)
          redirect()
        })
      break
    case "PATCH":
      await axios.patch(url, data) //"1"-??? need to make a little rectify in controller
        .then(response => {
          setData(response.data)
          redirect()
        })
      break
    case "GET":
      await axios.get(url)
        .then(response => {
          setData(response.data)
          redirect()
        })
      break
    default:
  }
}