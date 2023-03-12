import React, {Fragment} from 'react';
import {Button} from "react-bootstrap";
import BackButton from "../UI/BackButton";
import Input from "../UI/Input";

const ScaleSelection =  ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  const handlingOnClickNext = () => {
    steps.push('MemeSelection')
    console.log(steps)
    saveDataToDb( steps, {})
  }
  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
        <div>
          <div>
            <h1>1.1. ScaleSelection</h1>
          </div>
          <div>
            <h2>A new one! What's up?</h2>
          </div>
          <div>
            <h3>What word best describes your week?</h3>
            <Input className=''/>
          </div>
          <div>
            <h2>How do you feel about this word?</h2>
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

export default ScaleSelection;