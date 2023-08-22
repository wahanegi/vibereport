import React, {Fragment} from 'react';
import {BtnOutline, Wrapper} from "../UI/ShareContent";
import QuestionButton from "../UI/QuestionButton";
import {rangeFormat} from "../helpers/helpers";
import {Link} from "react-router-dom";
import Logo from "../UI/Logo";

const CheckInClosed = ({ data }) => {
  const {check_in_time_period} = data

  return<Fragment>
    <Wrapper className='position-relative'>
      <Logo />
      <div className='central-element'>
        <div className='mt-64'>
          <h1 className='muted'>The check-in for <br/>
            {rangeFormat(check_in_time_period)}<br/>
            has closed.
          </h1>
          <div className='row mb-0'>
            <h4>But, good news!<br/><br/>There’s a new check-in available.</h4>
          </div>
        </div>
        <Link to={'/'}>
          <BtnOutline text='Start new check-in' addClass='w-auto px-1'/>
        </Link>
      </div>
    </Wrapper>
    <QuestionButton data={data} />
  </Fragment>
};

export default CheckInClosed;