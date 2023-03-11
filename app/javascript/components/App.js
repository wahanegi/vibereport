import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter, Navigate, redirect, Route, Routes, useNavigate} from 'react-router-dom'
import ListEmotions from "./Pages/ListEmotions";
import ResponseFlow from "./ResponseFlow";
import EmotionEntry from "./Pages/EmotionEntry";
import Hierarchy from "./Pages/Hierarchy";
import axios from "axios";
import {isEmpty} from "./helpers/helper";
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
  const [curUserId, setCurUserId] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [step, setStep] = useState(null)
  const [respAttr, setRespAttr] = useState(null)
  const [emotionDataRespUserIdTimePeriod, setEmotionDataRespUserIdTimePeriod] = useState(null)
  const [isNotLoadedData, setIsNotLoadedData] = useState(true)
  // const [data, setData] = useState({front:{word:""},end:{}})


console.log("APP beforeUseEffect")
  useEffect(()=>{
    if (isNotLoadedData) {
      console.log("APP insideUseEffect")
      setIsLoading(true)
      axios.get('/api/v1/emotions.json')
        // LOAD Emotions (3*12) and Response data of authorized user from DB
        //data = {data:{
        //               data: {Emotions:{id:..., category:..., word:...},
        //               response:{attributes: {step: "[\"ListEmotions\"]", word:""}},
        //               current_user_id: ...,
        //               time_period:{...}
        //              }
        //            }
        .then(data => {
          setIsNotLoadedData(false)
          console.log("fullData", data)
          let dataEmotRespUserIdTimePeriod = data.data //let data:{Emotions}, response:{attributes}, current_user_id, time_period
          let respAttr = dataEmotRespUserIdTimePeriod.response
          console.log("received", dataEmotRespUserIdTimePeriod)
          let steps = JSON.parse(respAttr.attributes.step) //transform "[\"ListEmotions\"]" to the object
          console.log("App steps=", steps)
          setEmotionDataRespUserIdTimePeriod(dataEmotRespUserIdTimePeriod) // save
          // setCurUserId(dataRespUserIdTimePeriod.current_user_id)
          // setRespAttr(respAttr.attributes)
          console.log("setRespAttr(respAttr.attributes)", respAttr)
          if (steps.length === 0) {
            console.log("insideUseEffect setStep('ListEmotions')")
            setStep('ListEmotions')
          } else {
            setStep(steps.pop())
            console.log("setStep(steps.pop())", steps)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoading(false)
        })
    }
  },[])
  console.log("afterUseEffect")


  const LIST_OF_ROUTES = ALL_STEPS.map((item, index) => {
    return <Route key={item.id}
                  path={`/${ALL_STEPS[index].step}`}
                  element={<Hierarchy  step={item.step}
                                       data={emotionDataRespUserIdTimePeriod}
                                       setData={setEmotionDataRespUserIdTimePeriod}/>} />
  })

  return(
    <Fragment>
    {/* <ResponseProvider>*/}
      {isNotLoadedData && <p>Loading...</p>}
      <BrowserRouter>
        {!!step && !isNotLoadedData && <Routes>
          <Route path="*" element={<Navigate to={`/${step}`} data={emotionDataRespUserIdTimePeriod}
                                             setData={setEmotionDataRespUserIdTimePeriod} />}/>
          {/*{!step && <Route path="*" element={<Navigate to={`/${ALL_STEPS[0].step}`}/>}/>}*/}
          {LIST_OF_ROUTES}
        </Routes>}
      </BrowserRouter>
     {/*</ResponseProvider>*/}
    </Fragment>
  )
}
export default App;