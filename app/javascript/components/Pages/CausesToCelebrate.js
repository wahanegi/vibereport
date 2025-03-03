import React, {useEffect, useState} from 'react';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import Layout from '../Layout';
import {MAX_CHAR_LIMIT} from '../helpers/consts';

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
                    <h1 className="fs-xl-1 fs-sm-2 fs-3 mb-xxl-7 mb-md-5 mb-2">
                        Are there any recent <br/> causes to celebrate?
                    </h1>
                    <form className="mx-auto w-100 wrap-textarea-bad-follow">
                          <textarea className="border-1 w-100 p-1 h-100 shadow-none resize-none"
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
