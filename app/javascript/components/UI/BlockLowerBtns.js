import React from 'react';
import {BtnBack, BtnPrimary} from "./ShareContent";
import {backHandling} from "../helpers/helpers";

const BlockLowerBtns = ({ isNext = true, skipHandling, nextHandling }) => {
  return (
    <div className='d-flex position-absolute placement-buttons justify-content-between col-6 offset-3 pb-6'>
      <BtnBack onClick={backHandling}/>
      {isNext  && <BtnPrimary text='Next' onClick={nextHandling} />}
      {!isNext && <BtnPrimary text='Skip' onClick={skipHandling} />}
    </div>
  );
};

export default BlockLowerBtns;