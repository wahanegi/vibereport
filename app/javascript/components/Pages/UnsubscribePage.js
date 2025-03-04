import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {isPresent} from '../helpers/helpers';
import Layout from '../Layout';
import {apiRequest} from '../requests/axios_requests';
import Button from '../UI/Button';

const UnsubscribePage = ({data}) => {
  const {current_user, time_period} = data;
  const [unsubscribed, setUnsubscribed] = useState(current_user.opt_out);

  const onUnsubscribe = () => {
    const dataSend = {opt_out: true};
    const dataFromServer = ({current_user}) => {
      if (isPresent(current_user)) {
        setUnsubscribed(true);
      }
    };
    const url = '/api/v1/users/';
    const id = current_user.id;
    apiRequest(
      'PATCH',
      dataSend,
      dataFromServer,
      () => {
      },
      `${url}${id}`
    ).then();
  };

  const Unsubscribe = () => (
    <Fragment>
      <div className="mt-5 col-12 col-md-8 col-lg-6 mx-auto px-2">
        <h1 className="fs-md-1 mb-3">
          You will be unsubscribed from future check-in reminders.
        </h1>
        <h3 className="fs-md-3 text-gray-600 mb-2">
          You can always resubscribe by contacting your admin.
        </h3>
      </div>
      <div className="text-center mb-2">
        <Button
          className="btn-modal c1 w-auto border-0 px-3 mb-3"
          onClick={onUnsubscribe}
        >
          Unsubscribe
        </Button>
      </div>
      <div className="text-center">
        <Link to={'/'} target="_self" rel="noopener noreferrer">
          <Button className="btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 mt-1">
            Cancel
          </Button>
        </Link>
      </div>
    </Fragment>
  );

  const Unsubscribed = () => (
    <Fragment>
      <div className="col-12 col-md-8 col-lg-6 mx-auto px-2 mb-4">
        <h1 className="mb-1 px-lg-2 fs-md-1 mt-1 mt-sm-0">
          You have been unsubscribed from check-in reminders.
        </h1>
        <h3 className="text-gray-600 fs-md-3">
          You can close this window, or continue below.
        </h3>
      </div>
      <div className="text-center mb-7">
        <Link to={'/'} target="_self" rel="noopener noreferrer">
          <Button className="btn-modal c1 w-auto border-0 px-2">
            Start a check-in
          </Button>
        </Link>
      </div>
      <div className="text-center">
        <Link
          to={`/results/${time_period.slug}`}
          target="_self"
          rel="noopener noreferrer"
        >
          <Button className="btn-modal c1 bg-gray-200 bg-gray-hover-200 w-auto px-3 mt-3">
            Recent results
          </Button>
        </Link>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      <Layout data={data} draft={true} isResult={true} hideShoutout={true}>
        <div>{unsubscribed ? <Unsubscribed/> : <Unsubscribe/>}</div>
      </Layout>
    </Fragment>
  );
};

export default UnsubscribePage;
