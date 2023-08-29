import React, {useEffect, useState} from "react"
import {
  Wrapper
} from "../UI/ShareContent";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";
import {MAX_CHAR_LIMIT} from "../helpers/consts";

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {response} = data
  const {isLoading, error} = service
  const { celebrate_comment } = response.attributes
  const [celebrateComment, setCelebrateComment] = useState(celebrate_comment || '')
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = { celebrate_comment: celebrateComment, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  }

  const onClickSkip = () =>{
    steps.push('recognition')
    saveDataToDb( steps , {celebrate_comment: null})
  }

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value)
  }

  useEffect(() => {
    if (celebrate_comment !== celebrateComment && isDraft) {
      setIsDraft(false);
    }
  }, [celebrateComment]);

  const handlingOnClickNext = () => {
    steps.push('recognition')
    saveDataToDb( steps, {celebrate_comment: celebrateComment, draft: false})
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <div className='central-element'>
      <h1>Are there any recent <br/> causes to celebrate?</h1>
      <div className="rating-comment-container">
        <div className="wrap-textarea wrap-textarea-bad-follow">
          <form>
            <div className="form-group">
              <label className="comment-label">
                <textarea
                  className="form-control w660-h350-br15"
                  placeholder='Are you grateful for anything that happened at work recently?'
                  defaultValue={celebrateComment}
                  onChange={onCommentChange}
                  maxLength={MAX_CHAR_LIMIT}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
    <BlockLowerBtns nextHandling={ handlingOnClickNext } skipHandling={onClickSkip} />
    <CornerElements data = { data }
                    setData = { setData }
                    saveDataToDb={saveDataToDb}
                    steps={steps}
                    draft={isDraft}
                    handleSaveDraft={handleSaveDraft} />
  </Wrapper>
}

export default CausesToCelebrate;