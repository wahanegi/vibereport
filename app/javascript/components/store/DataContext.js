import React, {useEffect, useState} from 'react';
import {apiRequest} from "../requests/axios_requests";

const DataContext = React.createContext({
  data:{
    id:null,
    type:null,
    attributes: {
      word:null,
      category: null
    }
  },
  current_user: null,
  emotion:{id: null, word:null, category: null},
  response: {
    id: null,
    type: null, attributes:{
      steps:[ 'emotion-selection-web']}},
  time_period: {},
  setDataFromServer: (data) => {}
});

export const DataProvider = (props) => {
  const mainPage = 'emotion-selection-web';
  const [error, setError] = useState('')
  const [step, setStep] = useState(mainPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotLoadedData, setIsNotLoadedData] = useState(true)
  const [isShuffleEmotions, setIsShuffleEmotions] = useState(false);

  const [data, setData] = useState({
    data:{
      id:null,
      type:null,
      attributes: {
        word:null,
        category: null
      }
    },
    current_user: null,
    emotion:{id: null, word:null, category: null},
    response: {
      id: null,
      type: null, attributes:{
        steps:[ 'emotion-selection-web']}},
    time_period: {}
  });

  useEffect(()=>{
    const setData = ( dataFromServer ) => {
      let steps = dataFromServer.response.attributes.steps
      if (!Array.isArray(steps)) {
        dataFromServer = {...dataFromServer, response:{...dataFromServer.response,
            attributes: {...dataFromServer.response.attributes, steps: [mainPage] }}}
        steps = [mainPage]
      }
      console.log({dataFromServer})
      setDataFromServerHandler(dataFromServer);
      let lastStep = steps.slice(-1).toString()
      setStep(lastStep)
      setIsLoading(false)
      setIsNotLoadedData(false)
    }
    if (isNotLoadedData || isShuffleEmotions) {
      setIsLoading(true)
      apiRequest('GET', {}, setData, ()=>{}, '/api/v1/emotions')
        .then(() => {
          setIsShuffleEmotions(false);
          setIsLoading(false);
        })
        .catch(e => setError(e.message))
    }
  },[isShuffleEmotions])

  const setDataFromServerHandler = (data) => {
    setData(data);
  };

  const dataContext = {
    data: data,
    setDataFromServer: setDataFromServerHandler
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;