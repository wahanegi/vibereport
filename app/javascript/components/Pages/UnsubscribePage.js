import React, {useState} from 'react';
import {isPresent} from '../helpers/helpers';
import Layout from '../Layout';
import {apiRequest} from '../requests/axios_requests';
import {Button} from "react-bootstrap";

const UnsubscribePage = ({data}) => {
    const {current_user, time_period} = data;
    const [unsubscribed, setUnsubscribed] = useState(current_user.opt_out);

    const Prompt = () => <div className={'mb-3'}>
        <h1 className="fs-md-1 mb-3">
            {unsubscribed ?
                'You have been unsubscribed from check-in reminders.'
                : ' You will be unsubscribed from future check-in reminders.'}
        </h1>
        <h3 className="fs-md-3 text-gray-600">
            {unsubscribed ?
                'You can close this window, or continue below.'
                : 'You can always resubscribe by contacting your admin.'}
        </h3>
    </div>

    const UnsubscribeOrCancel = () => {
        const handleUnsubscribe = async () => {
            const dataSend = {opt_out: true};
            const dataFromServer = ({current_user}) => {
                if (isPresent(current_user)) {
                    setUnsubscribed(true);
                }
            };
            const skipRedirect = () => {
            }
            const url = `/api/v1/users/${current_user.id}`;

            await apiRequest('PATCH', dataSend, dataFromServer, skipRedirect, url);
        };

        return <>
            <Button className="btn-modal c1 w-auto border-0 px-3 mb-5 fs-7 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6"
                    onClick={handleUnsubscribe}>
                Unsubscribe
            </Button>
            <Button href={'/'} target="_self" rel="noopener noreferrer"
                    className="btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 fs-7 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6 border-0 d-flex align-items-center">
                Cancel
            </Button>
        </>
    }

    const CheckInOrRecentResult = () => <>
        <Button href={'/'} target="_self" rel="noopener noreferrer"
                className="btn-modal c1 w-auto border-0 px-3 mb-5 fs-7 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6 d-flex align-items-center">
            Start a check-in
        </Button>
        <Button href={`/results/${time_period.slug}`} target="_self" rel="noopener noreferrer"
                className="btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 fs-7 fs-xxl-5 fs-xl-5 fs-lg-5 fs-md-6 fs-sm-6 border-0 d-flex align-items-center">
            Recent results
        </Button>
    </>

    return <Layout data={data} draft={true} isResult={true} hideShoutout={true}>
        <div className="d-flex flex-column align-items-center mt-5 col-12 col-xxl-5 col-xl-6 col-lg-8 col-md-10 px-2">
            <Prompt/>
            {unsubscribed ? <CheckInOrRecentResult/> : <UnsubscribeOrCancel/>}
        </div>
    </Layout>
};

export default UnsubscribePage;
