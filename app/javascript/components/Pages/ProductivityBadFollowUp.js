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
    steps.push('causes-to-celebrate');
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
        <div className="w-100 mx-sm-1">
          <h1 className="fs-3 fs-md-1 mt-2 mb-5">It's like that sometimes...</h1>
          <h2 className="text-black fs-4 fs-md-3 mb-4">
            Reflect on what you think limited <br/> your productivity...
          </h2>

          <form className="mx-2">
            <label className="w-100 wrap-textarea-bad-follow resize-none">
              <textarea
                className="border-1 w-100 p-1 h-100 fs-5"
                placeholder="Is there anything that we can do to help?"
                defaultValue={productivity_comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                maxLength={MAX_CHAR_LIMIT}
              />
            </label>
          </form>

          <div className="mt-4">
            <BlockLowerBtns nextHandling={handlingOnClickNext}/>
          </div>
        </div>
      </Layout>
    )
  );
};

export default ProductivityBadFollowUp;
