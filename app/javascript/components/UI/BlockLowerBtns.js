import React from 'react';
import {BtnBack, BtnPrimary} from "./ShareContent";
import {backHandling, isEmptyStr} from "../helpers/helpers";

const BlockLowerBtns = ({ isNext = true,
                            isSubmit = false,
                            skipHandling = ()=>{} ,
                            nextHandling = ()=>{},
                            disabled = false,
                            stringBody = '',
                            handlingOnClickNext = () =>{}}) => {
  return (
      <div className='d-flex justify-content-around'>
          <div className='d-flex position-absolute placement-buttons justify-content-between pb-52'>
              <BtnBack onClick={backHandling}/>
              {isNext  && !isSubmit && <BtnPrimary text='Next' onClick={nextHandling} disabled={disabled} />}
              {!isNext && !isSubmit && <BtnPrimary text='Skip' onClick={skipHandling} />}
              {isSubmit && <BtnPrimary onClick={handlingOnClickNext}
                                       text={isEmptyStr(stringBody) ? 'Skip to Results' : 'Submit'} />}
          </div>
      </div>
  );
};

export default BlockLowerBtns;