import React, {Fragment, useEffect, useState} from 'react';
import {Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";
import {apiRequest} from "../requests/axios_requests";
import {Link} from "react-router-dom";
import {isPresent} from "../helpers/helpers";
  
const UnsubscribePage = ({data}) => {
  const {current_user, time_period} = data
  const [unsubscribed, setUnsubscribed] = useState(current_user.opt_out)

  const onUnsubscribe = () => {
    const dataSend = { opt_out: true }
    const dataFromServer = ({success}) => {
      if (success) {
        setUnsubscribed(true)
      }
    }
    const url = '/api/v1/users/'
    const id = current_user.id
    apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then();
  }

  const Unsubscribe = () => <Fragment>
    <div className='mb-5 mt-4'>
      <h1>You will be unsubscribed from <br/> future check-in reminders.</h1>
      <h4 className='muted mt-2 mb-2'>You can always resubscribe by <br/> contacting your admin.</h4>
    </div>
    <div className='text-center mt-2 mb-115'>
      <button className='btn btn-regular c1 border-0' onClick={onUnsubscribe}>
        Unsubscribe
      </button>
    </div>
    <div className='text-center mb-1 mt-5'>
      <Link to={'/'} target="_self" rel="noopener noreferrer">
        <button className='btn btn-regular back c1 border-0'>
          Cancel
        </button>
      </Link>
    </div>
  </Fragment>

  const Unsubscribed = () => <Fragment>
    <div className='mb-5 mt-4'>
      <h1>You have been unsubscribed <br/> from check-in reminders.</h1>
      <h4 className='muted mt-2 mb-2'>You can close this window, or continue below.</h4>
    </div>
    <div className='text-center mt-2 mb-115'>
      <Link to={'/'} target="_self" rel="noopener noreferrer">
        <button className='btn btn-regular c1 border-0'>
          Start a check-in
        </button>
      </Link>
    </div>
    <div className='text-center mb-1 mt-5'>
      <Link to={`/results/${time_period.slug}`} target="_self" rel="noopener noreferrer">
        <button className='btn btn-regular back c1 border-0'>
          Recent results
        </button>
      </Link>
    </div>
  </Fragment>

  return <Fragment>
    <Wrapper>
      <div className='central-element'>
        {unsubscribed ?
          <Unsubscribed />:
          <Unsubscribe />
        }
      </div>
      <CornerElements data={data} draft={true} />
    </Wrapper>
  </Fragment>
};

export default UnsubscribePage;
