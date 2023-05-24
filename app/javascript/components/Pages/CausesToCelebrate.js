import React, {useEffect, useState} from "react"
import {
  Footer, Header, Logo, Wrapper
} from "../UI/ShareContent";
import Menu from "../UI/Menu";
import { MentionsInput, Mention } from 'react-mentions'
import mentionsInputStyles from "../UI/mention/mentionsInputStyles";

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
    // steps.push('ProductivityCheckLow')
    saveDataToDb( steps , {celebrate_comment: null})
  }
  console.log(data.response.attributes)
  const onClickNext = () => {
    // steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {celebrate_comment: celebrateComment, draft: false})
  }

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <Menu saveDataToDb={saveDataToDb} steps={steps} draft={isDraft} handleSaveDraft={handleSaveDraft}>X% complete</Menu>
  </div>

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value)
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <h1>Are there any recent <br/> causes to celebrate?</h1>
    <div className='d-flex justify-content-center'>
      <MentionsInput value={celebrateComment}
                     onChange={onCommentChange}
                     placeholder='Are you grateful for anything that happened at work recently?'
                     style={mentionsInputStyles}
      >
        <Mention
          className={'mentions-mention'}
          trigger="@"
          displayTransform={(id, display) => `@${display}`}
          data={users}
        />
      </MentionsInput>
    </div>

    <Footer nextClick={onClickNext}
            skipClick={onClickSkip}
            hideNext={celebrateComment === ''}
            hideSkip={celebrateComment !== ''}/>
  </Wrapper>
}

export default CausesToCelebrate;