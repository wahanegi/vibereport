import React from 'react';
import {backHandling} from "../helpers/helpers";
import {BtnBack} from "../UI/ShareContent";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  return <div>
    <p>User was not working for this time period</p>
    <div>
      <BtnBack onClick={backHandling} />
    </div>
  </div>
}
export default Results;
