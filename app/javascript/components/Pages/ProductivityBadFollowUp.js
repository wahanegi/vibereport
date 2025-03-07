import React, {useEffect, useState} from 'react';
import {MAX_CHAR_LIMIT} from '../helpers/consts';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';

const ProductivityBadFollowUp = ({
                                   data,
                                   setData,
                                   saveDataToDb,
                                   steps,
                                   service,
                                   draft,
                                 }) => {
  const {isLoading, error} = service;
  const {productivity_comment} = data.response.attributes;
  const [comment, setComment] = useState(productivity_comment || '');
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = {productivity_comment: comment, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  useEffect(() => {
    if (productivity_comment !== comment && isDraft) {
      setIsDraft(false);
    }
  }, [comment]);

  const handlingOnClickNext = () => {
    if (data.timesheet_enabled) {
      steps.push('timesheet');
    } else {
      steps.push('causes-to-celebrate');
    }
    saveDataToDb(steps, {productivity_comment: comment, draft: false});
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
        <div className="container-fluid w-100 mx-sm-1 pt-1 pt-md-0">
          <h1 className="fs-md-1 mb-5">It's like that sometimes...</h1>
          <h2 className="fs-md-4 text-black mb-4">
            Reflect on what you think limited <br/> your productivity...
          </h2>

          <form className="mx-2">
            <label className="w-100 wrap-textarea-bad-follow">
              <textarea
                className="border-1 w-100 p-2 h-100 resize-none shadow-none fs-8 fs-md-7"
                placeholder="Is there anything that we can do to help?"
                defaultValue={productivity_comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                maxLength={MAX_CHAR_LIMIT}
              />
            </label>
          </form>
        </div>
        <div className="w-100 mt-xxl-10 mt-md-6 mt-4 mx-1 align-self-end">
            <BlockLowerBtns nextHandling={handlingOnClickNext}/>
        </div>
      </Layout>
    )
  );
};

export default ProductivityBadFollowUp;