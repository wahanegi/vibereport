import React, { useState } from "react"
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
  const dataDraft = {celebrate_comment: celebrateComment || null}
  const [isDraft, setDraft] = useState(draft);

  const handleSaveDraft = () => {
    saveDataToDb(steps, dataDraft);
    setDraft(true)
  }

  useEffect(() => {
    const comment = response.attributes.celebrate_comment
    if (celebrateComment !== comment && isDraft) {
      setDraft(false);
    }
  }, [celebrateComment]);

  const onClickSkip = () =>{
    steps.push('recognition')
    saveDataToDb( steps , {celebrate_comment: null})
  }
  console.log(data.response.attributes)
  const onClickNext = () => {
    steps.push('recognition')
    saveDataToDb( steps, {celebrate_comment: celebrateComment, draft: false})
  }

<<<<<<< HEAD
  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <Menu saveDataToDb={saveDataToDb} steps={steps} draft={isDraft} handleSaveDraft={handleSaveDraft}>X% complete</Menu>
  </div>

=======
>>>>>>> master
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
                    percentCompletion = { 40 } />
  </Wrapper>
}

export default CausesToCelebrate;