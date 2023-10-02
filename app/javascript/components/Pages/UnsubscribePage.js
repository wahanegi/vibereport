import React, {Fragment, useEffect, useState} from 'react';
import {Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";
import {apiRequest} from "../requests/axios_requests";
import {Link} from "react-router-dom";
import Button from "../UI/Button";
  
const UnsubscribePage = ({data}) => {
  const {current_user, time_period} = data
  const [unsubscribed, setUnsubscribed] = useState(current_user.opt_out)
  const isManager = data.is_manager;
  const previewValue = isManager ? 'result-managers' : 'results';

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
    <div className='mt-5'>
      <h1 className='mb-1'>You will be unsubscribed from <br/> future check-in reminders.</h1>
      <h4 className='muted mb-2'>You can always resubscribe by <br/> contacting your admin.</h4>
    </div>
    <div className='text-center mb-2'>
      <Button className='btn-modal c1 w-auto border-0 px-3 mb-3' onClick={onUnsubscribe}>
        Unsubscribe
      </Button>
    </div>
    <div className='text-center'>
      <Link to={'/'} target="_self" rel="noopener noreferrer">
        <Button className='btn-modal c1 back w-auto px-3 mt-1'>
          Cancel
        </Button>
      </Link>
    </div>
  </Fragment>

  const Unsubscribed = () => <Fragment>
    <div className='mt-5'>
      <h1 className='mb-1'>You have been unsubscribed from <br/> check-in reminders.</h1>
      <h4 className='muted mb-3'>You can close this window, or continue below.</h4>
    </div>
    <div className='text-center'>
      <Link to={'/'} target="_self" rel="noopener noreferrer">
        <Button className='btn-modal c1 w-auto border-0 px-2 mb-3 mt-1'>
          Start a check-in
        </Button>
      </Link>
    </div>
    <div className='text-center'>
      <Link to={`/results/${time_period.slug}`} target="_self" rel="noopener noreferrer">
        <Button className='btn-modal c1 back w-auto px-3 mt-3'>
          Recent results
        </Button>
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
      <CornerElements data={data} draft={true} preview={previewValue} hideShoutout={true} />
    </Wrapper>
  </Fragment>
};

export default UnsubscribePage;
