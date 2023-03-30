import React, {Fragment, useEffect, useState} from 'react';
import BackButton from "../UI/BackButton";
import Button from "../UI/Button";

const FollowUpPosWordOnly = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

    const handlingOnClickNext = () => {
      steps.push('ProductivityCheckLow')
      saveDataToDb( steps, {})
    }

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
    <div>
      <div><h1>3.1. FollowUpPosWordOnly</h1></div>
      <div><h2>Sensational week? Most excellent!</h2></div>
      <div><h3>Select how intense the feeling was</h3></div>
        <div>
          <span className="under-convert">1</span>
          <span className="under-convert">2</span>
          <span className="under-convert">3</span>
          <span className="under-convert">4</span>
          <span className="under-convert">5</span>
        </div>

      <div>
        <Button className='success'>{data.emotion.word}</Button>
      </div>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        <Button onClick={handlingOnClickNext}>Next</Button>
      </div>
    </div>}
    </Fragment>
  )
};

export default FollowUpPosWordOnly;