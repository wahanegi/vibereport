import React, { useEffect, useState } from 'react';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import Layout from '../Layout';
import { MAX_CHAR_LIMIT } from '../helpers/consts';
import { Form } from 'react-bootstrap';

const CausesToCelebrate = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const { response } = data;
  const { isLoading, error } = service;
  const { celebrate_comment } = response.attributes;
  const [celebrateComment, setCelebrateComment] = useState(
    celebrate_comment || ''
  );
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = { celebrate_comment: celebrateComment, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  const onClickSkip = () => {
    steps.push('recognition');
    saveDataToDb(steps, { celebrate_comment: null });
  };

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value);
  };

  useEffect(() => {
    if (celebrate_comment !== celebrateComment && isDraft) {
      setIsDraft(false);
    }
  }, [celebrateComment]);

  const handlingOnClickNext = () => {
    steps.push('recognition');
    saveDataToDb(steps, { celebrate_comment: celebrateComment, draft: false });
  };

  if (!!error) return <p>{error.message}</p>;

  return (
    !isLoading && (
      <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={isDraft}
        handleSaveDraft={handleSaveDraft}
      >
        <div className="d-flex flex-column gap-5 py-1">
          <h1>Are there any recent causes to celebrate?</h1>
          <div className="comment-label px-1">
            <textarea
              className="shadow-none p-2 w-100 h-100 rounded-5"
              placeholder="Are you grateful for anything that happened at work recently?"
              defaultValue={celebrateComment}
              onChange={onCommentChange}
              maxLength={MAX_CHAR_LIMIT}
              rows={10}
            />
          </div>
          <div className='mx-1'>
          <BlockLowerBtns
            nextHandling={handlingOnClickNext}
            skipHandling={onClickSkip}
          />
          </div>
        </div>
      </Layout >
    )
  );
};

export default CausesToCelebrate;
