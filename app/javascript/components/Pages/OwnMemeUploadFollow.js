import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {backHandling} from "../helpers/helpers";
import {BtnBack, BtnNext} from "../UI/ShareContent";

const OwnMemeUploadFollow = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
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
        <div>
          <Button className={data.emotion.category}>{data.emotion.word}</Button>
        </div>
        <div className='mt-5'>
          <BtnBack onClick={backHandling} />
          <BtnNext onClick={handlingOnClickNext} />
        </div>
      </div>}
    </Fragment>
  );
};

export default OwnMemeUploadFollow;