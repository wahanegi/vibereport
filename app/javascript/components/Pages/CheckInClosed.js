import React from 'react';
import {useNavigate} from "react-router-dom";
import {rangeFormat} from "../helpers/helpers";
import {BtnOutline} from "../UI/ShareContent";

const CheckInClosed = ({data: {check_in_time_period}}) => {
    const navigate = useNavigate()
    const formatTimePeriod = rangeFormat(check_in_time_period)

    const handleResult = () => {
        if (check_in_time_period) {
            navigate(`/results/${check_in_time_period.slug}`)
        } else {
            navigate(`/results`)
        }
    }

    return <div className='container vh-100 d-flex flex-column align-items-center justify-content-center text-center'>
        <div className='mt-4'>
            <h1 className='text-muted'>The check-in for <br/>
                {formatTimePeriod}<br/>
                has closed.
            </h1>
        </div>

        <BtnOutline text='See the Results' addClass={'mt-3'} onClick={handleResult}/>
    </div>
};

export default CheckInClosed;