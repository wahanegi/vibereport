import React, {useState} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";

const ProductivityBadFollowUp = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { bad_follow_comment } = data.response.attributes
  const [comment, setComment] = useState(bad_follow_comment || '');
  // const handlingOnClickNext = () => {
  //
  //   // steps.push('productivity-check')
  //   saveDataToDb( steps, {bad_follow_comment: comment})
  // }

  // Temporary placement not ready page Shoutout
  const handlingOnClickNext = () => {
    if (!data.fun_question){
      steps.push('causes-to-celebrate')
      saveDataToDb( steps, {bad_follow_comment: comment})
    }else
      steps.push('icebreaker-answer')
      saveDataToDb( steps, {bad_follow_comment: comment})
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <h1>It's like that sometimes...</h1>
      <h2 className="color-black">Reflect on what you think limited <br /> your productivity...</h2>
      <div className="rating-comment-container">
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
    <Footer nextClick={handlingOnClickNext} />
  </Wrapper>
};

export default ProductivityBadFollowUp;