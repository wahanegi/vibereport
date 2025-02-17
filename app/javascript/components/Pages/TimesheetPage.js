import React from 'react';
import Layout from "../Layout";
import BlockLowerBtns from "../UI/BlockLowerBtns";

const TimesheetPage = ({
                         data,
                         setData,
                         saveDataToDb,
                         steps,
                         service,
                         draft,
                       }) => {
  const {isLoading, error} = service;

  const handlingOnClickNext = () => {
    steps.push('causes-to-celebrate');
    saveDataToDb(steps, {timesheet: null});
  }

  return (
    !isLoading && (
      <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={draft}
      >
        <div className="container-fluid">
          <div className="row flex-column justify-content-center">
            <div className="col-12 text-center mx-auto">
              <h1 className="my-1 my-md-2">Your Timesheet</h1>
            </div>
            <div className="col-12 col-lg-6 col-md-8 mx-auto">Timesheet table</div>
            <div className="col-12 col-md-6 mb-4 mx-auto"></div>
          </div>
          <div className="max-width-entry mx-auto">
            <BlockLowerBtns
              nextHandling={handlingOnClickNext}
              isNext={false}
              isSubmit={false}
            />
          </div>
        </div>
      </Layout>
    )
  );
};

export default TimesheetPage;
