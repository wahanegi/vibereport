import React, {Fragment} from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const ProductivityCheckLow = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const handlingOnClickNext = () => {

  }
  return (
    <Fragment>
      <h1>4.1. ProductivityCheckLow</h1>
      <h1>How productive has this week felt to you?</h1>
      <h2> 50% flame for example</h2>
      <label htmlFor="file">Intense of flame:</label>
      <progress id="file" value="50" max="100"></progress>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        <Button onClick={handlingOnClickNext}>Next</Button>
      </div>
    </Fragment>
  );
};

export default ProductivityCheckLow;