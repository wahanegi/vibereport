import React, {Fragment, useState} from 'react';
import {Button} from "react-bootstrap";
import {backHandling} from "../helpers/helpers";
import {BtnBack, BtnNext, Footer, Header, Wrapper} from "../UI/ShareContent";

const ProductivityBadFollowUp = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const { bad_follow_comment } = data.response.attributes
  const [comment, setComment] = useState(bad_follow_comment || '');
  const handlingOnClickNext = () => {
    steps.push('productivity-check')
    saveDataToDb( steps, {bad_follow_comment: comment})
  }
  {console.log('bad_follow_comment', bad_follow_comment)}
  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <div className='text-center h1'>It's like that sometimes...</div>
      <div className='text-center h3'>Reflect on what limited your productivity this week...</div>
      <div className="rating-comment-container">
        <form>
          <div className="form-group">
            <label className="comment-label">
              <textarea
                className="form-control"
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