import React from 'react';
import Layout from '../../Layout';
import {signOutUser} from '../../requests/axios_requests';
import Button from '../../UI/Button';
import {reformatDate} from "../../helpers/helpers";

const RatherNotSay = ({
                          data,
                          setData,
                          saveDataToDb,
                          steps,
                          service,
                          draft,
                      }) => {
    const Prompt = () => <>
        <h1>We'll be here...</h1>
        <h2>
            Feel free to return to this check-in
            <br/>before it closes on {reformatDate(data.time_period.end_date)}
        </h2>
    </>

    const LogoutOrBack = () => {
        const handleLogout = () => {
            const id = data?.response?.id;
            steps.push('emotion-selection-web');
            saveDataToDb(steps, {draft: false});
            signOutUser(id).then(() => (window.location.href = `/sign_in`));
        };

        const handleBack = () => {
            steps.push('emotion-selection-web');
            saveDataToDb(steps, {draft: false});
        };

        return <>
            <Button className="btn-modal c1 btn-wide fs-6 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6"
                    onClick={handleLogout}>
                Ok, log out
            </Button>
            <Button
                className="btn-modal bg-gray-200 bg-gray-hover-200 c1 btn-wide fs-6 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6"
                onClick={handleBack}>
                Back to check-in
            </Button>
        </>
    }

    return <Layout data={data}
                   setData={setData}
                   saveDataToDb={saveDataToDb}
                   steps={steps}
                   draft={draft}>
        <div className={"d-flex flex-column justify-content-center align-items-center gap-4 mt-5"}>
            <Prompt/>
            <LogoutOrBack/>
        </div>
    </Layout>
};

export default RatherNotSay;
