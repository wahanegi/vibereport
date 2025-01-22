import React, {useState, useEffect} from 'react';
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";
import {MAX_CHAR_LIMIT} from "../helpers/consts";

const ProductivityBadFollowUp = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {isLoading, error} = service
  const { productivity_comment } = data.response.attributes
  const [comment, setComment] = useState(productivity_comment || '');
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = { productivity_comment: comment, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  }

  useEffect(() => {
   if (productivity_comment !== comment && isDraft) {
      setIsDraft(false);
    }
  }, [comment]);

  const handlingOnClickNext = () => {
    steps.push('causes-to-celebrate')
    saveDataToDb( steps, {productivity_comment: comment, draft: false})
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <>
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
                  defaultValue={productivity_comment}
                  onChange={(e) => {setComment(e.target.value)} }
                  maxLength={MAX_CHAR_LIMIT}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
    <BlockLowerBtns nextHandling={ handlingOnClickNext } />
    <CornerElements data = { data }
                    setData = { setData }
                    saveDataToDb={saveDataToDb}
                    steps={steps}
                    draft={isDraft}
                    handleSaveDraft={handleSaveDraft} />
  </>
};

export default ProductivityBadFollowUp;