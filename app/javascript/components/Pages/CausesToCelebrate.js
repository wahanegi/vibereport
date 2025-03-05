import React, {useEffect, useState} from 'react';
import {MAX_CHAR_LIMIT} from '../helpers/consts';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';

const CausesToCelebrate = ({
                             data,
                             setData,
                             saveDataToDb,
                             steps,
                             service,
                             draft,
                           }) => {
  const {response} = data;
  const {isLoading, error} = service;
  const {celebrate_comment} = response.attributes;
  const [celebrateComment, setCelebrateComment] = useState(
    celebrate_comment || ''
  );
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = {celebrate_comment: celebrateComment, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  const onClickSkip = () => {
    steps.push('recognition');
    saveDataToDb(steps, {celebrate_comment: null});
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
    saveDataToDb(steps, {celebrate_comment: celebrateComment, draft: false});
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
                handleSaveDraft={handleSaveDraft}>
                <div className="w-100 mx-1 d-flex flex-column align-items-center">
                    <h1 className="fs-md-1 mb-5">
                        Are there any recent <br/> causes to celebrate?
                    </h1>
                    <form className="wrap-textarea-bad-follow mx-auto w-100">
                          <textarea className="w-100 p-1 h-100 fs-8 fs-md-7 border-1 shadow-none resize-none text-black fs-7 fs-md-6"
                                    placeholder="Are you grateful for anything that happened at work recently?"
                                    defaultValue={celebrateComment}
                                    onChange={onCommentChange}
                                    maxLength={MAX_CHAR_LIMIT}/>
                    </form>
                </div>
                <div className="w-100 mt-xxl-10 mt-md-6 mt-4 align-self-end">
                    <BlockLowerBtns nextHandling={handlingOnClickNext}
                                    skipHandling={onClickSkip}/>
                </div>
            </Layout>
        )
    );
};

export default CausesToCelebrate;