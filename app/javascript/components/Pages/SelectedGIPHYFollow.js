import React, {Fragment, useEffect, useState} from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const SelectedGiphyFollow = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  const handlingOnClickNext = () => {
    steps.push('FollowUpPosMeme')
    saveDataToDb( steps, {})
  }

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
    <div>
      <h1>2.25 SelectedGIPHYFollow</h1>
        <div>
          <h2>Excellent choice</h2>
        </div>
        <div>
          <h3>You uploaded</h3>
        </div>
        <div>
          <Button className={data.response.attributes.category}>{data.response.attributes.word}</Button>
        </div>
        <div>
          <BackButton data={data} setData={setData}>Back</BackButton>
        </div>
        <div>
          |<Button onClick={handlingOnClickNext}>Next</Button>
        </div>
    </div>}
    </Fragment>
  );
};

export default SelectedGiphyFollow;