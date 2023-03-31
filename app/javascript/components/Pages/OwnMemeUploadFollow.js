import React, {Fragment, useEffect, useState} from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const OwnMemeUploadFollow = ({data, setData, saveDataToDb, steps, service}) => {
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
      <div>
        <h1>2.26 OwnMemeUploadFollow</h1>
      </div>
      <div>
        <h2>A new one ...Nice!</h2>
      </div>
      <div>
      <h3>You uploaded</h3>
      </div>
        <Button className={data.emotion.category}>{data.emotion.word}</Button>
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

export default OwnMemeUploadFollow;