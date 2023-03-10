import React from 'react';
import ListEmotions from "./ListEmotions";
import MemeSelection from "./MemeSelection";
import EmotionEntry from "./EmotionEntry";
// import Figma from "../helper_functions/all_steps";
import SelectedGIPHYFollow from "./SelectedGIPHYFollow";
import OwnMemeUploadFollow from "./OwnMemeUploadFollow";
import FollowUpPosWordOnly from "./FollowUpPosWordOnly";

const Hierarchy = ({step, data, setData}) => {

  console.log("Results", data)
  switch (step) {
    case  "ListEmotions" :
      return <ListEmotions data={data}  setData={setData}/>
    case  "MemeSelection" :
      return <MemeSelection data={data}  setData={setData}/>
    case  "EmotionEntry" :
      return <EmotionEntry data={data}  setData={setData}/>
    case  "SelectedGIPHYFollow" :
      return <SelectedGIPHYFollow data={data}  setData={setData}/>
    case  "OwnMemeUploadFollow" :
      return <OwnMemeUploadFollow data={data}  setData={setData}/>
    case  "FollowUpPosWordOnly" :
      return <FollowUpPosWordOnly data={data}  setData={setData}/>
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
