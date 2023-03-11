import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter, Navigate,  Route, Routes} from 'react-router-dom'
import ListEmotions from "./Pages/ListEmotions";
import EmotionEntry from "./Pages/EmotionEntry";
import Hierarchy from "./Pages/Hierarchy";
import axios from "axios";
// import ResponseProvider from "./store/ResponseProvider";

const ALL_STEPS = [
  {id:"1", step:"ListEmotions"},
  {id:"2.0", step: "MemeSelection"},
  {id:"1.1", step:"EmotionEntry"},
  {id:"2.25", step:"SelectedGIPHYFollow"},
  {id:"2.26", step:"OwnMemeUploadFollow"},
  {id:"3.1.", step:"FollowUpPosWordOnly"},
  {id:"3.2.", step:"FollowUpPosMeme"},
  {id:"4.1.", step:"ProductivityCheckLow"},
  {id:"4.25.", step:"ProductivityBadFollowUp"},
  {id:"5", step:"CausesToCelebrate"},
  {id:"6", step:"ShoutoutPromptNone"},
  {id:"6.X.", step:"ShoutoutModalExample"},
  {id:"6.XX", step:"ShoutoutModal_FlexUse"},
  {id:"7v2", step:"Icebreaker"},
  {id:"7", step:"MemeWallThisWeekSoFar"},
  {id:"7.1.", step:"MemeWallPrevWeek"},
  {id:"7.3.", step:"MemeWallThisWeek"},
  {id:"7.X.1.", step:"MemeWallThisWeekSoFarDrop"},
  {id:"8", step:"PromptEmailResults"},
]
const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(null)
  const [emotionDataRespUserIdTimePeriod, setEmotionDataRespUserIdTimePeriod] = useState(null)
  const [isNotLoadedData, setIsNotLoadedData] = useState(true)


  useEffect(()=>{
    if (isNotLoadedData) {
      setIsLoading(true)
      axios.get('/api/v1/emotions.json')
        // LOAD Emotions (3*12) and Response data of authorized user from DB
        // Below data for the start entry of user
        // data = {data:{
        //               data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
        //               response:{attributes: {step: "[\"ListEmotions\"]", word:""}},
        //               current_user_id: ...,
        //               time_period:{...}
        //               }
        //        }
        .then(data => {
          setIsNotLoadedData(false)
          let arrWithSteps = JSON.parse(data.data.response.attributes.step)
          //save data:{Emotions}, response:{attributes}, current_user_id, time_period
          setEmotionDataRespUserIdTimePeriod(data.data)
          if (arrWithSteps.length === 0) {
            setStep('ListEmotions')
          } else {
            setStep(arrWithSteps.pop())
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoading(false)
        })
    }
  },[])

// building routes which defined in constant ALL_STEPS
  const listOfRoutes = ALL_STEPS.map((item, index) => {
    return <Route key={item.id}
                  path={`/${ALL_STEPS[index].step}`}
                  element={<Hierarchy  step={item.step}
                                       data={emotionDataRespUserIdTimePeriod}
                                       setData={setEmotionDataRespUserIdTimePeriod}/>} />
  })

  return(
    <Fragment>
    {/* <ResponseProvider>*/}
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <BrowserRouter>
        {!!step && !isNotLoadedData && <Routes>
          <Route path="*" element={<Navigate to={`/${step}`} data={emotionDataRespUserIdTimePeriod}
                                             setData={setEmotionDataRespUserIdTimePeriod} />}/>
          {listOfRoutes}
        </Routes>}
      </BrowserRouter>
     {/*</ResponseProvider>*/}
    </Fragment>
  )
}
export default App;