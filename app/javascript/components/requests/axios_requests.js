import React from "react";
import axios from "axios";

export const createCsrfToken = () => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
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
    case "DESTROY":
      await axios.delete(url).then(redirect())
      break
    default:
  }
}

export const signOutUser = async (id) =>{
  createCsrfToken()
  await axios.get(`/api/v1/sign_out_user?id=${id}` ).then()
}
