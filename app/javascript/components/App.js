import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter, Navigate,  Route, Routes} from 'react-router-dom'
import ResponseFlow from "./ResponseFlow";
import axios from "axios";
import { ALL_STEPS } from "./helpers/routes";

const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [error, setError] = useState('')
  const [step, setStep] = useState(null)
  const [frontDatabase, setFrontDatabase] = useState(null)
  const [isNotLoadedData, setIsNotLoadedData] = useState(true)

  const mainPage = 'emotion-selection-web'

  useEffect(()=>{
    if (isNotLoadedData) {
      setIsLoading(true)
      axios.get('/api/v1/emotions.json')
        // frontDatabase
        // LOAD Emotions (3*12), emotion_attr and Response data of authorized user from DB
        // Below format of data for the start entry of user
        // data = {data:{
        //               data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... } }, //36 rows
        //               emotion_attr: {word: "", category: ""}                                      //first entry
        //               response:{attributes: { steps: "[\"emotion-selection-web\"]" } },            //strong format
        //               current_user_id: ...,
        //               time_period:{...}
        //               }
        //        }
        .then(data => {
          setIsNotLoadedData(false)
          let arrWithSteps = JSON.parse(data.data.response.attributes.steps)
          //save data:{Emotions}, response:{attributes}, current_user_id, time_period
          setFrontDatabase(data.data)
          if (arrWithSteps === undefined || arrWithSteps.length === 0) {
            setStep(mainPage)
          } else {
            let lastStepFromDBofServer = arrWithSteps.pop()
            setStep(lastStepFromDBofServer)
          }
          setIsLoading(false)
          setIsLoadingSteps(false);
        })
        .catch((error) => {
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
        {!!step && !isNotLoadedData && <Routes>
          <Route path="*" element={<Navigate to={`/${step}`}
                                             data={frontDatabase}
                                             setData={setFrontDatabase} />}/>
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
        </Routes>}
      </BrowserRouter>
    </Fragment>
  )
}
export default App;