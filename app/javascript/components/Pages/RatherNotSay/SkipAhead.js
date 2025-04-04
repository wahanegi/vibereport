import React from 'react';
import Layout from '../../Layout';
import {signOutUser} from '../../requests/axios_requests';
import Button from '../../UI/Button';

const RatherNotSay = ({
                        data,
                        setData,
                        saveDataToDb,
                        steps,
                        service,
                        draft,
                      }) => {
  const xCloseData = data.time_period.end_date;

  const reformatData = (date) => {
    let dt = new Date(date);
    let options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(dt);
  };

  const logoutHandling = () => {
    const id = data?.response?.id;
    steps.push('emotion-selection-web');
    saveDataToDb(steps, {draft: false});
    signOutUser(id).then(() => (window.location.href = `/sign_in`));
  };

  const backHandling = () => {
    steps.push('emotion-selection-web');
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
        <h1>We'll be here...</h1>
        <h2>{`Feel free to return to this check-in\n before it closes on ${reformatData(
          xCloseData
        )}`}</h2>
        <Button className="btn-modal c1 btn-wide" onClick={logoutHandling}>
          Ok, log out
        </Button>
        <Button className="btn-modal bg-gray-200 bg-gray-hover-200 c1 btn-wide" onClick={backHandling}>
          Back to check-in
        </Button>
      </div>
    </Layout>
  );
};

export default RatherNotSay;
