import React from 'react';
import Layout from '../../Layout';
import Button from '../../UI/Button';

const RatherNotSay = ({
                          data,
                          setData,
                          saveDataToDb,
                          steps,
                          service,
                          draft,
                      }) => {
    const Prompt = () => <>
        <h1>That's okay.</h1>
        <h2>Would you like to continue <br/> with your check-in?</h2>
    </>

    const SkipOrNo = () => {
        const handleSkip = () => {
            steps.push('productivity-check');
            saveDataToDb(steps, {draft: false});
        };

        const handleNoSkip = () => {
            steps.push('skip-ahead');
            saveDataToDb(steps, {draft: false});
        };

        return <>
            <Button className="btn-modal c1 btn-wide fs-6 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6"
                    onClick={handleSkip}>
                Yes, skip ahead
            </Button>
            <Button
                className="btn-modal c1 bg-gray-200 bg-gray-hover-200 btn-no fs-6 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6"
                onClick={handleNoSkip}>
                No
            </Button>
        </>
    }

    return <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={draft}>
        <div className={"d-flex flex-column justify-content-center align-items-center gap-4 mt-5"}>
            <Prompt/>
            <SkipOrNo/>
        </div>
    </Layout>
};

export default RatherNotSay;
