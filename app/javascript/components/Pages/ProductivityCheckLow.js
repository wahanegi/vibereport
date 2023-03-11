import React from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const ProductivityCheckLow = () => {
  const nextHandling = () => {

  }
  return (
    <Fragment>
      <h1>How productive has this week felt to you?</h1>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        <Button onClick={nextHandling}>Next</Button>
      </div>
    </Fragment>
  );
};

export default ProductivityCheckLow;