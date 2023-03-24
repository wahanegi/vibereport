import React from "react";
import axios from "axios";

export const createCsrfToken = () => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

export const createResponse = async (emotion_id, time_period_id, navigate, steps, not_working = false) => {
  createCsrfToken()
  await axios.post('/api/v1/responses', {emotion_id, time_period_id, steps, not_working})
    .then(resp => {
      not_working ? navigate(`/app/results`) : navigate(`/responses/${resp.data.data.id}`)
    })
    .catch(resp => {console.log(resp)})
}

export const updateResponse = async (response, setResponse) => {
  createCsrfToken()
  await axios.patch(`/api/v1/responses/${response.id}`, response.attributes)
    .then(resp => {
      setResponse({...resp.data.data})
    })
    .catch(resp => {console.log(resp)})
}

export const removeResponse = async (data, setData) => {
  createCsrfToken()
  await axios.delete(`/api/v1/responses/${data.response.id}`)
    .then(() => {
      setData(Object.assign({}, data, { response: { attributes: { steps: ['emotion-selection-web'] }} }))
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
export async function requests_answers(method, data = {}, setData = {}, redirect = ()=>{}, url = '/api/v1/emotions') {
  createCsrfToken()
  console.time("FETCH")
  console.log("start time of  FETCH",(new Date()).getMilliseconds())
  try {
    let init = {
      'method': method,
      'mode': 'cors',
      'cache': 'no-cache',
      'credentials': 'same-origin',
      'headers': {'Content-type': 'application/json'}
    }
    if (method !=='GET') {init = {...init,  'body': JSON.stringify(data)}}

    const responce = await fetch(`${"http://localhost:3000"}${url}`, init  )
    const answer = await responce.json()
    console.timeEnd("FETCH")
    console.log("     end time of FETCH",(new Date()).getMilliseconds())
    console.log("     answer FETCH - STEPS = ",answer.response.attributes.steps)
    await setData( answer )
  }
  catch (e) {
    console.log(e.message)
    return true
  }
  // finally {
  //     console.log ("Error bind with API exception")
  // }
}