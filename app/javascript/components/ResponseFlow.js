import React, {useEffect, useState} from 'react';
import ListEmotions from "./Pages/ListEmotions";
import MemeSelection from "./Pages/MemeSelection";
import EmotionEntry from "./Pages/EmotionEntry";
import SelectedGIPHYFollow from "./Pages/SelectedGIPHYFollow";
import OwnMemeUploadFollow from "./Pages/OwnMemeUploadFollow";
import FollowUpPosWordOnly from "./Pages/FollowUpPosWordOnly";
import {apiRequest} from "./requests/axios_requests";
import {mergeData} from "./helper_functions/library";
import {useNavigate} from "react-router-dom";
import FollowUpPosMeme from "./Pages/FollowUpPosMeme";
import ProductivityCheckLow from "./Pages/ProductivityCheckLow";
import ScaleSelection from "./Pages/ScaleSelection";

const ResponseFlow = ({step, data, setData}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const stepsArr = JSON.parse(data.response.attributes.steps)
  const navigate = useNavigate()
  const service = { isLoading,  error , setIsLoading}
console.log(step)

  useEffect(()=> {
      window.addEventListener('popstate', function(event) {
        event.preventDefault()
        const handlingSteps =( answer ) =>{
          const stepsFromDBofServer = JSON.parse(answer.response.attributes.steps)
          stepsFromDBofServer.pop()
          if (stepsFromDBofServer.length > 0) {saveDataToDb( stepsFromDBofServer )}
          else{
            window.location.replace(
              window.location.origin+`/${stepsFromDBofServer[0]}`
            );
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
    const dataRequest = {response:{steps: JSON.stringify(stepsArr),...addedData}}
    setIsLoading(true)
    createOrUpdate (data, dataRequest, saveDataToAttributes)
  }

  const createOrUpdate = (data, dataRequest, saveDataToAttributes) => {
    console.log(data.response.attributes.id)
    console.log(data.response)
    data.response.attributes.emotion_id === undefined ?
      //create new record in the Response table
      apiRequest("POST", dataRequest, saveDataToAttributes ).catch(e=>setError(e))
      :
      apiRequest("PATCH", dataRequest, saveDataToAttributes, ()=>{},'/api/v1/responses/' + data.response.id).catch(e=>setError(e))
  }

  //***  include received data from the apiRequest to the variable **:data** (**:emotionDataRespUserIdTimePeriod** in App)
  // shortly: including data from server to the front database
  const saveDataToAttributes =( receivedData ) =>{
    setIsLoading(false)
    mergeData( receivedData, data, setData )
    navigate(`/${JSON.parse(receivedData.data.attributes.steps).pop()}`)
  }

  switch (step) {
    case  "emotion-selection-web" :
      return <ListEmotions data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "ScaleSelection" :
      return <ScaleSelection data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "meme-selection" :
      return <MemeSelection data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "EmotionEntry" :
      return <EmotionEntry data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "SelectedGIPHYFollow" :
      return <SelectedGIPHYFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "OwnMemeUploadFollow" :
      return <OwnMemeUploadFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "FollowUpPosWordOnly" :
      return <FollowUpPosWordOnly data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "FollowUpPosMeme" :
      return <FollowUpPosMeme data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    case  "ProductivityCheckLow" :
      return <ProductivityCheckLow data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ProductivityBadFollowUp" :
    //   return <ProductivityBadFollowUp data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "CausesToCelebrate" :
    //   return <CausesToCelebrate data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutPromptNone" :
    //   return <ShoutoutPromptNone data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutModalExample" :
    //   return <ShoutoutModalExample data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "ShoutoutModal_FlexUse" :
    //   return <ShoutoutModal_FlexUse data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
    // case  "Icebreaker" :
    //   return <Icebreaker data={data} setData={setData} saveDataToDb={saveDataToDb} steps={stepsArr} service={service} />
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
      0
  }
}
export default ResponseFlow;
