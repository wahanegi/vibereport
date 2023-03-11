import React, {useState} from 'react';
import ListEmotions from "./ListEmotions";
import MemeSelection from "./MemeSelection";
import EmotionEntry from "./EmotionEntry";
// import Figma from "../helper_functions/all_steps";
import SelectedGIPHYFollow from "./SelectedGIPHYFollow";
import OwnMemeUploadFollow from "./OwnMemeUploadFollow";
import FollowUpPosWordOnly from "./FollowUpPosWordOnly";
import {apiRequest} from "../requests/axios_requests";
import {mergeData} from "../helper_functions/library";
import {useNavigate} from "react-router-dom";
import FollowUpPosMeme from "./FollowUpPosMeme";
import ProductivityCheckLow from "./ProductivityCheckLow";

const Hierarchy = ({step, data, setData}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const steps = JSON.parse(data.response.attributes.step)
  const navigate = useNavigate()
  const system = { isLoading,  error }

  //*** **setError** - Hook for handling error messages
  //*** **steps** - array with steps of user for update in DB
  //*** **addedData** - necessary data (and future data) for update in DB by using Response controller
  //*** Format addedData = **{key: value, ...., key(n): value(n)}**
  const saveDataToDb = ( steps, addedData = {}) =>{
    const dataRequest = {response:{step: JSON.stringify(steps),...addedData}}
    setIsLoading(true)
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
    console.log("navigate", receivedData.attributes.step)
    navigate(`/${JSON.parse(receivedData.attributes.step).pop()}`)
  }

  console.log("<Hierarchy >", data, "</Hierarchy>")
  switch (step) {
    case  "ListEmotions" :
      return <ListEmotions data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "MemeSelection" :
      return <MemeSelection data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "EmotionEntry" :
      return <EmotionEntry data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "SelectedGIPHYFollow" :
      return <SelectedGIPHYFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "OwnMemeUploadFollow" :
      return <OwnMemeUploadFollow data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "FollowUpPosWordOnly" :
      return <FollowUpPosWordOnly data={data}  setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "FollowUpPosMeme" :
      return <FollowUpPosMeme data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    case  "ProductivityCheckLow" :
      return <ProductivityCheckLow data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "ProductivityBadFollowUp" :
    //   return <ProductivityBadFollowUp data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "CausesToCelebrate" :
    //   return <CausesToCelebrate data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "ShoutoutPromptNone" :
    //   return <ShoutoutPromptNone data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "ShoutoutModalExample" :
    //   return <ShoutoutModalExample data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "ShoutoutModal_FlexUse" :
    //   return <ShoutoutModal_FlexUse data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "Icebreaker" :
    //   return <Icebreaker data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "MemeWallThisWeekSoFar" :
    //   return <MemeWallThisWeekSoFar data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "MemeWallPrevWeek" :
    //   return <MemeWallPrevWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "MemeWallThisWeek" :
    //   return <MemeWallThisWeek data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "MemeWallThisWeekSoFarDrop" :
    //   return <MemeWallThisWeekSoFarDrop data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    // case  "PromptEmailResults" :
    //   return <PromptEmailResults data={data} setData={setData} saveDataToDb={saveDataToDb} steps={steps} system={system} />
    default:
      0
  }
}
export default Hierarchy;
