import React, {Fragment, useState} from 'react';
import Layout from '../Layout';
import {apiRequest} from "../requests/axios_requests";
import {Link} from "react-router-dom";
import Button from "../UI/Button";
import {isPresent} from "../helpers/helpers";

const UnsubscribePage = ({data}) => {
  const {current_user, time_period} = data
  const [unsubscribed, setUnsubscribed] = useState(current_user.opt_out)

  const onUnsubscribe = () => {
    const dataSend = { opt_out: true }
    const dataFromServer = ({current_user}) => {
      if (isPresent(current_user)) {
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
        <Button className='btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 mt-1'>
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
        <Button className='btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 mt-3'>
          Recent results
        </Button>
      </Link>
    </div>
  </Fragment>

  return <Fragment>
    <Layout data={data} draft={true} isResult={true} hideShoutout={true}>
      <div className='central-element'>
        {unsubscribed ?
          <Unsubscribed />:
          <Unsubscribe />
        }
      </div>
    </Layout>
  </Fragment>
};

export default UnsubscribePage;
