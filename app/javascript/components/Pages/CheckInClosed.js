import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {rangeFormat} from "../helpers/helpers";
import QuestionButton from "../UI/QuestionButton";
import {BtnOutline} from "../UI/ShareContent";

const CheckInClosed = ({data}) => {
  const {check_in_time_period} = data

  return <Fragment>
    <div className='container vh-100 d-flex flex-column align-items-center justify-content-center text-center'>
      <div className='mt-4'>
        <h1 className='text-muted'>The check-in for <br/>
          {rangeFormat(check_in_time_period)}<br/>
          has closed.
        </h1>
      </div>
      <Link to={'/'} className={"mt-3"}>
        <BtnOutline text='See the Results'/>
      </Link>
      <div className='mt-4'>
        <QuestionButton data={data}/>
      </div>
    </div>
  </Fragment>
};

export default CheckInClosed;