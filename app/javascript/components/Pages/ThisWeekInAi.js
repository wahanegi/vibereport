import React, {useEffect, useState} from 'react';
import {MAX_CHAR_LIMIT} from '../helpers/consts';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';

const AI_QUESTION = 'What was your most memorable interaction with AI this week?';

const ThisWeekInAi = ({
                        data,
                        setData,
                        saveDataToDb,
                        steps,
                        service,
                        draft,
                      }) => {
  const {response} = data;
  const {isLoading, error} = service;
  const {ai_answer} = response.attributes;
  const [aiAnswer, setAiAnswer] = useState(ai_answer || '');
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = {ai_question: AI_QUESTION, ai_answer: aiAnswer, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  const onClickSkip = () => {
    steps.push('recognition');
    saveDataToDb(steps, {ai_question: AI_QUESTION, ai_answer: null});
  };

  const onCommentChange = (e) => {
    setAiAnswer(e.target.value);
  };

  useEffect(() => {
    if (ai_answer !== aiAnswer && isDraft) {
      setIsDraft(false);
    }
  }, [aiAnswer]);

  const handlingOnClickNext = () => {
    steps.push('recognition');
    saveDataToDb(steps, {ai_question: AI_QUESTION, ai_answer: aiAnswer, draft: false});
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
                    <h1 className="fs-md-1 mb-5 col-12 col-lg-6 mx-auto text-center">
                        {AI_QUESTION}
                    </h1>
                    <form className="wrap-textarea-bad-follow mx-auto w-100">
                          <textarea className="w-100 p-1 h-100 fs-8 fs-md-7 border-1 shadow-none resize-none text-black fs-7 fs-md-6"
                                    placeholder="Tell us about a memorable moment you had with AI this week."
                                    defaultValue={aiAnswer}
                                    onChange={onCommentChange}
                                    maxLength={MAX_CHAR_LIMIT}/>
                    </form>
                </div>
                <div className="w-100 mt-xxl-10 mt-md-6 mt-4 mx-1 align-self-end">
                    <BlockLowerBtns nextHandling={handlingOnClickNext}
                                    skipHandling={onClickSkip}/>
                </div>
            </Layout>
        )
    );
};

export default ThisWeekInAi;
