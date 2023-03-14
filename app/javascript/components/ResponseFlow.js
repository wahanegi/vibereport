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
  const steps = JSON.parse(data.response.attributes.step)
  const navigate = useNavigate()
  const service = { isLoading,  error }

  useEffect(()=> {
      window.addEventListener('popstate', function(event) {
        event.preventDefault()
        const handlingSteps =( answer ) =>{
          console.log("EVENT", answer)
          const stepsFromDB = JSON.parse(answer.response.attributes.step)
          stepsFromDB.pop()
          if (stepsFromDB.length > 0) {saveDataToDb( stepsFromDB )}
          else{
            window.location.replace(
              window.location.origin+`/${stepsFromDB[0]}`
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
  const saveDataToDb = ( steps, addedData = {}) =>{
    const dataRequest = {response:{step: JSON.stringify(steps),...addedData}}
    setIsLoading(true)
    createOrUpdate (data, dataRequest, saveDataToAttributes)
  }

  const createOrUpdate = (data, dataRequest, saveDataToAttributes) => {
    data.response.attributes.word ==="" ?
      //create new record in the Response table
      apiRequest("POST", dataRequest, saveDataToAttributes).catch(e=>setError(e))
      :
      apiRequest("PATCH", dataRequest, saveDataToAttributes).catch(e=>setError(e))
  }

  //***  include received data from the apiRequest to the variable **:data** (**:emotionDataRespUserIdTimePeriod** in App)
  const saveDataToAttributes =( receivedData ) =>{
    setIsLoading(false)
    mergeData( receivedData, data, setData )
    let step = JSON.parse(receivedData.attributes.step)
    navigate(`/${JSON.parse(receivedData.attributes.step).pop()}`)
  }

  switch (step) {
    case  "emotion-selection-web" :
      return <ListEmotions data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "ScaleSelection" :
      return <ScaleSelection data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "MemeSelection" :
      return <MemeSelection data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "EmotionEntry" :
      return <EmotionEntry data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "SelectedGIPHYFollow" :
      return <SelectedGIPHYFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "OwnMemeUploadFollow" :
      return <OwnMemeUploadFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "FollowUpPosWordOnly" :
      return <FollowUpPosWordOnly data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "FollowUpPosMeme" :
      return <FollowUpPosMeme data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    case  "ProductivityCheckLow" :
      return <ProductivityCheckLow data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "ProductivityBadFollowUp" :
    //   return <ProductivityBadFollowUp data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "CausesToCelebrate" :
    //   return <CausesToCelebrate data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "ShoutoutPromptNone" :
    //   return <ShoutoutPromptNone data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "ShoutoutModalExample" :
    //   return <ShoutoutModalExample data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "ShoutoutModal_FlexUse" :
    //   return <ShoutoutModal_FlexUse data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "Icebreaker" :
    //   return <Icebreaker data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "MemeWallThisWeekSoFar" :
    //   return <MemeWallThisWeekSoFar data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "MemeWallPrevWeek" :
    //   return <MemeWallPrevWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "MemeWallThisWeek" :
    //   return <MemeWallThisWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "MemeWallThisWeekSoFarDrop" :
    //   return <MemeWallThisWeekSoFarDrop data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    // case  "PromptEmailResults" :
    //   return <PromptEmailResults data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} service={service} />
    default:
      0
  }
}
export default ResponseFlow;
