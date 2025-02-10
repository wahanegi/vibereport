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
  const skipHandling = () => {
    steps.push('productivity-check');
    saveDataToDb(steps, {draft: false});
  };

  const noHandling = () => {
    steps.push('skip-ahead');
    saveDataToDb(steps, {draft: false});
  };

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={draft}
    >
      <div className={"d-flex flex-column justify-content-center align-items-center gap-4 mt-5"}>
        <h1>That's okay.</h1>
        <h2>Would you like to continue <br/> with your check-in?</h2>
        <Button className="btn-modal c1 btn-wide" onClick={skipHandling}>
          Yes, skip ahead
        </Button>
        <Button className="btn-modal c1 bg-gray-200 bg-gray-hover-200 btn-no" onClick={noHandling}>
          No
        </Button>
      </div>
    </Layout>
  );
};

export default RatherNotSay;
