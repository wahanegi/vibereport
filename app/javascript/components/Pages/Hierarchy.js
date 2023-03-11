import React from 'react';
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

const Hierarchy = ({step, data, setData}) => {
  const navigate = useNavigate()

  //*** **setError** - Hook for handling error messages
  //*** **steps** - array with steps of user for update in DB
  //*** **addedData** - necessary data (and future data) for update in DB by using Response controller
  //*** Format addedData = **{key: value, ...., key(n): value(n)}**
  const saveDataToDb = (setError, steps, addedData = {}) =>{
    const dataRequest = {response:{step: JSON.stringify(steps),...addedData}}
    apiRequest("PATCH", dataRequest, saveDataToAttributes).catch(e=>setError(e))
  }

  //***  include received data from the apiRequest to the variable **:data** (**:emotionDataRespUserIdTimePeriod** in App)
  const saveDataToAttributes =( receivedData ) =>{
    mergeData( receivedData, data, setData )
    console.log("navigate", receivedData.attributes.step)
    navigate(`/${JSON.parse(receivedData.attributes.step).pop()}`)
  }

  console.log("<Hierarchy >", data, "</Hierarchy>")
  switch (step) {
    case  "ListEmotions" :
      return <ListEmotions data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    case  "MemeSelection" :
      return <MemeSelection data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    case  "EmotionEntry" :
      return <EmotionEntry data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    case  "SelectedGIPHYFollow" :
      return <SelectedGIPHYFollow data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    case  "OwnMemeUploadFollow" :
      return <OwnMemeUploadFollow data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    case  "FollowUpPosWordOnly" :
      return <FollowUpPosWordOnly data={data}  setData={setData} saveDataToDb={saveDataToDb}/>
    // case  "FollowUpPosMeme" :
    //   return <FollowUpPosMeme data={data} setData={setData} />
    // case  "ProductivityCheckLow" :
    //   return <ProductivityCheckLow data={data} setData={setData} />
    // case  "ProductivityBadFollowUp" :
    //   return <ProductivityBadFollowUp data={data} setData={setData} />
    // case  "CausesToCelebrate" :
    //   return <CausesToCelebrate data={data} setData={setData} />
    // case  "ShoutoutPromptNone" :
    //   return <ShoutoutPromptNone data={data} setData={setData} />
    // case  "ShoutoutModalExample" :
    //   return <ShoutoutModalExample data={data} setData={setData} />
    // case  "ShoutoutModal_FlexUse" :
    //   return <ShoutoutModal_FlexUse data={data} setData={setData} />
    // case  "Icebreaker" :
    //   return <Icebreaker data={data} setData={setData} />
    // case  "MemeWallThisWeekSoFar" :
    //   return <MemeWallThisWeekSoFar data={data} setData={setData} />
    // case  "MemeWallPrevWeek" :
    //   return <MemeWallPrevWeek data={data} setData={setData} />
    // case  "MemeWallThisWeek" :
    //   return <MemeWallThisWeek data={data} setData={setData} />
    // case  "MemeWallThisWeekSoFarDrop" :
    //   return <MemeWallThisWeekSoFarDrop data={data} setData={setData} />
    // case  "PromptEmailResults" :
    //   return <PromptEmailResults data={data} setData={setData} />
    default:
      0
  }
}
export default Hierarchy;
