import React from 'react';
import {BigBtnEmotion, Wrapper} from "../UI/ShareContent";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";

const EmotionType = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service

  console.log('data', data)
  const handleSaveDraft = () => {
    saveDataToDb(steps, {draft: true});
  }

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
    saveDataToDb( steps, {draft: false})
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading &&
    <Wrapper>
      <div className='central-element'>
        <div className='mt-2 text-center'>
          <BigBtnEmotion showPencil={false} emotion={data.emotion} />
        </div>
      </div>
      <BlockLowerBtns nextHandling={ handlingOnClickNext } />
      <CornerElements data = { data }
                      setData = { setData }
                      saveDataToDb={saveDataToDb}
                      steps={steps}
                      draft={draft}
                      handleSaveDraft={handleSaveDraft}/>
    </Wrapper>
};

export default EmotionType;