import React from 'react';
import {BtnBack, BtnNext, BtnPrimary} from "./ShareContent";
import Button from "./Button";

const BlockLowerBtns = ({ isNext = true, skipHandling, nextHandling }) => {
  return (
    <div className='d-flex position-absolute row-buttons justify-content-between col-6 offset-3'>
      <BtnBack />
      {isNext  && <BtnPrimary text='Next' onClick={nextHandling} />}
      {!isNext && <BtnPrimary text='Skip' onClick={skipHandling} />}
    </div>
  );
};

export default BlockLowerBtns;