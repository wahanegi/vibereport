import React, {useState, useEffect} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";
import {isPresent} from "../helpers/helpers";

const ProductivityBadFollowUp = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const { bad_follow_comment } = data.response.attributes
  const [comment, setComment] = useState(bad_follow_comment || '');
  const dataDraft = {bad_follow_comment: comment}
  const [isDraft, setDraft] = useState(draft);

  const handleSaveDraft = () => {
    saveDataToDb(steps, dataDraft);
    setDraft(true)
  }

  console.log('page dataDraft', isDraft )

  useEffect(() => {
   if (bad_follow_comment !== comment && isDraft) {
      setDraft(false);
    }
  }, [comment]);

  // const handlingOnClickNext = () => {
  //   steps.push('causes-to-celebrate')
  //   saveDataToDb( steps, {bad_follow_comment: comment})
  // }

  // Temporary placement not ready page Shoutout
  const handlingOnClickNext = () => {
    if (!data.fun_question){
      steps.push('causes-to-celebrate')
      saveDataToDb( steps, {bad_follow_comment: comment, draft: false })
    }else {
      steps.push('icebreaker-answer')
      saveDataToDb(steps, {bad_follow_comment: comment, draft: false})
    }
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header saveDataToDb={saveDataToDb} steps={steps} draft={isDraft} handleSaveDraft={handleSaveDraft} />
    <div className='central-element'>
      <h1>It's like that sometimes...</h1>
      <h2 className="color-black">Reflect on what you think limited <br /> your productivity...</h2>
      <div className="rating-comment-container">
        <div className="wrap-textarea wrap-textarea-bad-follow">
          <form>
            <div className="form-group">
              <label className="comment-label">
                <textarea
                  className="form-control w660-h350-br15"
                  placeholder="Is there anything that we can do to help?"
                  defaultValue={bad_follow_comment}
                  onChange={(e) => {setComment(e.target.value)} }
                  maxLength={700}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer nextClick={handlingOnClickNext} />
  </Wrapper>
};

export default ProductivityBadFollowUp;