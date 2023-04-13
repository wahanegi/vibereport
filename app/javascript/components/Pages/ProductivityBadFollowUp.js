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
      <h1>ProductivityBadFollowUp</h1>
      <div className='mt-5'>
        <BtnBack onClick={backHandling} />
        <BtnNext onClick={handlingOnClickNext} />
      </div>
    </Fragment>
  );
};

export default ProductivityBadFollowUp;