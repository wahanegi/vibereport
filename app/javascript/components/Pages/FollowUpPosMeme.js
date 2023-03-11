import React, {Fragment} from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const FollowUpPosMeme = ({data, setData, saveDataToDb, steps, system}) => {
  const {isLoading, error} = system
  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {})
  }

  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
        <div>
          <h1>3.2. FollowUpPosMeme</h1>
          <h1>Select how intense the feeling was</h1>
          <div>
            <span className="under-convert">1</span>
            <span className="under-convert">2</span>
            <span className="under-convert">3</span>
            <span className="under-convert">4</span>
            <span className="under-convert">5</span>
          </div>
          <div>
            <BackButton data={data} setData={setData}>Back</BackButton>
          </div>
          <div>
            <Button onClick={handlingOnClickNext}>Next</Button>
          </div>
        </div>}
      </Fragment>
  );
};

export default FollowUpPosMeme;