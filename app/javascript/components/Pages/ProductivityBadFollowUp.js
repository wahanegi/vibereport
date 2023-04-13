import React, {Fragment} from 'react';
import {Button} from "react-bootstrap";
import {backHandling} from "../helpers/helpers";
import {BtnBack, BtnNext} from "../UI/ShareContent";

const ProductivityBadFollowUp = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const handlingOnClickNext = () => {

  }
  if (!!error) return <p>{error.message}</p>
  return (
    <Fragment>
      <h1>4.1. ProductivityCheck</h1>
      <h1>How productive has this week felt to you?</h1>
      <h2> 50% flame for example</h2>
      <label htmlFor="file">Intense of flame:</label>
      <progress id="file" value="50" max="100"></progress>
      <div className='mt-5'>
        <BtnBack onClick={backHandling} />
        <BtnNext onClick={handlingOnClickNext} />
      </div>
    </Fragment>
  );
};

export default ProductivityBadFollowUp;