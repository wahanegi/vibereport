import React, {useEffect, useState} from 'react';
import ListEmotions from "./Pages/ListEmotions";
import MemeSelection from "./Pages/MemeSelection";
import EmotionEntry from "./Pages/EmotionEntry";
import SelectedGIPHYFollow from "./Pages/SelectedGIPHYFollow";
import EmotionIntensity from "./Pages/EmotionIntensity";
import {apiRequest} from "./requests/axios_requests";
import {mergeData} from "./helpers/library";
import {useNavigate} from "react-router-dom";
import ProductivityCheckLow from "./Pages/ProductivityCheckLow";

import ProductivityBadFollowUp from "./Pages/ProductivityBadFollowUp";
import CausesToCelebrate from "./Pages/CausesToCelebrate";
import IcebreakerAnswer from "./Pages/IcebreakerAnswer";
import IcebreakerQuestion from "./Pages/IcebreakerQuestion";
import Results from "./Pages/ResultsPage";

const ResponseFlow = ({step, data, setData}) => {
  const [isLoading, setIsLoading] = useState(false)
          const [error, setError] = useState(false)
                   const stepsArr = data.response.attributes.steps
                   const navigate = useNavigate()
                    const service = { isLoading,  error , setIsLoading}

  const mainPage = 'emotion-selection-web'
  const [go, setGo] = useState(null)
  const [isCustomGif, setIsCustomGif] = useState(false)

  useEffect(()=>{
    //a block to give permission to transition on a page which was point the browser address bar
    let lastStep = stepsArr.slice(-1).toString()
    let index = stepsArr.indexOf(step)

      if ( stepsArr[0] !== mainPage ) {
        saveDataToDb([mainPage])
      }
      if (index === -1) {
        navigate(`/${lastStep}`)
        setGo(lastStep)
      } else if (index !== stepsArr.length-1) {
        saveDataToDb(stepsArr.slice(0, stepsArr.indexOf(step) + 1))
      } else {
        setGo(lastStep)
      }
  },[data])

  useEffect(()=> {
      window.addEventListener('popstate', function(event) {
        event.preventDefault()
        const handlingSteps =( answer ) =>{
          const stepsFromDBofServer = answer.response.attributes.steps
          if (stepsFromDBofServer.length > 1) {
            stepsFromDBofServer.pop()
            setGo(stepsFromDBofServer.slice(-1).toString())
            createOrUpdate( answer ,
              { response:{ attributes:{
                    emotion_id: answer.response.attributes.emotion_id,
                            id: answer.response.attributes.id,
                         steps: stepsFromDBofServer,
                time_period_id: answer.time_period.id,
                       user_id: answer.current_user.id
                }}}, saveDataToAttributes)}
          else{
            window.location.replace(window.location.origin+`/${stepsFromDBofServer[0]}` );
            setGo(stepsFromDBofServer[0])
          }
        }
        apiRequest("GET", "", handlingSteps, ()=>{}, '/api/v1/emotions.json').catch(e=>setError(e))

      });
  },[])

  //*** **setError** - Hook for handling error messages
  //*** **steps** - array with steps of user for update or save in DB
  //*** **addedData** - necessary data (and future data) for update or save in DB by using Response controller
  //*** Format addedData = **{key: value, ...., key(n): value(n)}**
  const saveDataToDb = ( stepsArr, addedData = {}) =>{
    const dataRequest = {response:{ attributes: { steps: stepsArr,...addedData } } }
    setIsLoading(true)
    createOrUpdate (data, dataRequest, saveDataToAttributes)
  }

  const createOrUpdate = (data, dataRequest, saveDataToAttributes) => {
    const url = '/api/v1/responses/' + data.response.attributes.id
    data.response.attributes.emotion_id === undefined ?
      //create new record in the Response table
      apiRequest("POST", dataRequest, saveDataToAttributes ).catch(e=>setError(e))
      :
      apiRequest("PATCH", dataRequest, saveDataToAttributes, ()=>{}, url ).catch(e=>setError(e))
  }

  //***  include received data from the apiRequest to the variable **:data (see :frontDATABASE in App)**
  // briefly: including data from server to the client-side database
  const saveDataToAttributes =( receivedData ) =>{
    setIsLoading(false)
    mergeData( receivedData, data, setData )
    let lastStep = receivedData.data.attributes.steps.slice(-1).toString()
    setGo( lastStep )
    navigate(`/${ lastStep }`)
  }

  switch (go) {
    case  "emotion-selection-web" :
      return <ListEmotions data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "emotion-entry" :
      return <EmotionEntry data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "meme-selection" :
      return <MemeSelection data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} isCustomGif={isCustomGif} setIsCustomGif={setIsCustomGif} />
    case  "results" :
      return <Results data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "selected-giphy-follow" :
      return <SelectedGIPHYFollow data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} isCustomGif={isCustomGif} />
    case  "emotion-intensity" :
      return <EmotionIntensity data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "productivity-check" :
      return <ProductivityCheckLow data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "productivity-bad-follow-up" :
      return <ProductivityBadFollowUp data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "causes-to-celebrate" :
       return <CausesToCelebrate data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutPromptNone" :
    //   return <ShoutoutPromptNone data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutModalExample" :
    //   return <ShoutoutModalExample data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutModal_FlexUse" :
    //   return <ShoutoutModal_FlexUse data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "icebreaker-answer" :
      return <IcebreakerAnswer data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "icebreaker-question" :
      return <IcebreakerQuestion data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "MemeWallThisWeekSoFar" :
    //   return <MemeWallThisWeekSoFar data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "MemeWallPrevWeek" :
    //   return <MemeWallPrevWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "MemeWallThisWeek" :
    //   return <MemeWallThisWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "MemeWallThisWeekSoFarDrop" :
    //   return <MemeWallThisWeekSoFarDrop data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "PromptEmailResults" :
    //   return <PromptEmailResults data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    default:
      // navigate ( `/emotion-selection-web`)

  }
}
export default ResponseFlow;
