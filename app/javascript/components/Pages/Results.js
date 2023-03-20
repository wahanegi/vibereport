import React from 'react';
import BackButton from "../UI/BackButton";

const Results = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  return <div>
    <p>User was not working for this time period</p>
    <div>
      <BackButton data={data} setData={setData}>Back</BackButton>
    </div>
  </div>
}
export default Results;
