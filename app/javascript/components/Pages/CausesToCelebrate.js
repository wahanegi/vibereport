import React, { useState, useEffect } from "react"
import {
  Wrapper
} from "../UI/ShareContent";
import { MentionsInput, Mention } from 'react-mentions'
import mentionsInputStyles from "../UI/mention/mentionsInputStyles";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {response, users} = data
  const {isLoading, error} = service
  const [celebrateComment, setCelebrateComment] = useState(response.attributes.celebrate_comment || '')
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = { celebrate_comment: celebrateComment || null, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  }

  useEffect(() => {
    const comment = response.attributes.celebrate_comment
    if (celebrateComment !== comment && isDraft) {
      setIsDraft(false);
    }
  }, [celebrateComment]);

  const onClickSkip = () =>{
    steps.push('recognition')
    saveDataToDb( steps , {celebrate_comment: null})
  }

  const onClickNext = () => {
    steps.push('recognition')
    saveDataToDb( steps, {celebrate_comment: celebrateComment, draft: false})
  }

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value)
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <h1 className='mt-151'>Are there any recent <br/> causes to celebrate?</h1>
    <div className='d-flex justify-content-center mt-1'>
      <MentionsInput value = { celebrateComment }
                     onChange = { onCommentChange }
                     placeholder = 'Are you grateful for anything that happened at work recently?'
                     style = { mentionsInputStyles }
      >
        <Mention
          className={'mentions-mention'}
          trigger="@"
          displayTransform={(id, display) => `@${display}`}
          data={users}
        />
      </MentionsInput>
    </div>
    <BlockLowerBtns nextHandling={ onClickNext } skipHandling={ onClickSkip } isNext={ celebrateComment !== '' } />
    <CornerElements data = { data }
                    setData = { setData }
                    saveDataToDb={saveDataToDb}
                    steps={steps}
                    draft={isDraft}
                    handleSaveDraft={handleSaveDraft} />
  </Wrapper>
}

export default CausesToCelebrate;