import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import ResponseFlow from "./ResponseFlow";
import { ALL_STEPS } from "./helpers/routes";
import {apiRequest} from "./requests/axios_requests";
import ResultsPreview from "./Pages/ResultsPage/ResultsPreview";
import ResultsPageManager from "./Pages/ResultsPageManager/ResultsPreview";
import CheckInClosed from "./Pages/CheckInClosed";
import UnsubscribePage from "./Pages/UnsubscribePage";

const initDB = {
  data:{id:null, type:null, attributes:{word:null, category: null}},
  current_user: null,
  emotion:{id: null, word:null, category: null},
  response: { id: null, type: null, attributes:{
      steps:[ 'emotion-selection-web']}},
  time_period: {}
}

const App = () => {
  const mainPage = 'emotion-selection-web'
  const [error, setError] = useState('')
  const [frontDatabase, setFrontDatabase] = useState(initDB)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotLoadedData, setIsNotLoadedData] = useState(true)
  const [step, setStep] = useState(mainPage)

  useEffect(()=>{
    const setData = ( dataFromServer ) => {
      let steps = dataFromServer.response.attributes.steps
      if (!Array.isArray(steps)) {
        dataFromServer = {...dataFromServer, response:{...dataFromServer.response,
            attributes:{...dataFromServer.response.attributes, steps: [mainPage] }}}
        steps = [mainPage]
      }
        setFrontDatabase(dataFromServer)
      let lastStep = steps.slice(-1).toString()
      setStep(lastStep)
      setIsLoading(false)
      setIsNotLoadedData(false)
    }
    if (isNotLoadedData) {
      setIsLoading(true)
      apiRequest('GET',{}, setData, ()=>{}, '/api/v1/emotions').catch((e)=>{
        setError(error.message)
        setIsLoading(false)
      })
    }
  },[frontDatabase])

  return(
    <Fragment>
      {isLoading && <p >Loading...</p>}
      {error && <p>{error}</p>}
      <BrowserRouter>
        {!isNotLoadedData && <Routes>
          <Route path="*" element={<Navigate to={`/${step}`}/>}/>
          {ALL_STEPS.map((item, index) => (
            <Route
              key={item.id}
              path={`/${ALL_STEPS[index].step}`}
              element={
                <ResponseFlow
                  step={item.step}
                  data={frontDatabase}
                  setData={setFrontDatabase}
                />
              }
            />
          ))}
          <Route path="results/:slug" element={<ResultsPreview />} />
          <Route path="check-in-closed" element={<CheckInClosed data={frontDatabase}/>} />
          <Route path="unsubscribe" element={<UnsubscribePage data={frontDatabase} />} />
          <Route path="result-managers/:slug" element={<ResultsPageManager />} />
        </Routes>}
      </BrowserRouter>
    </Fragment>
  )
}
export default App;