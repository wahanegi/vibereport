import React from 'react';
import {BtnBack, BtnPrimary} from './ShareContent';
import {backHandling, isEmptyStr} from '../helpers/helpers';

const BlockLowerBtns = ({
  isNext = true,
  isSubmit = false,
  skipHandling = () => {},
  nextHandling = () => {},
  disabled = false,
  stringBody = '',
  handlingOnClickNext = () => {},
  isDirectTimesheetMode = false,
}) => {
  return (
    <div
      className={`d-flex flex-column flex-sm-row ${isDirectTimesheetMode ? 'justify-content-end' : 'justify-content-sm-between'} align-items-center gap-2 gap-sm-0 max-width-btns mx-auto`}>
      {!isDirectTimesheetMode && <BtnBack onClick={backHandling} />}

      {isNext && !isSubmit && (
        <BtnPrimary text="Next" onClick={nextHandling} disabled={disabled} />
      )}

      {!isNext && !isSubmit && (
        <BtnPrimary text="Skip" onClick={skipHandling} />
      )}

      {isSubmit && (
        <BtnPrimary
          onClick={handlingOnClickNext}
          text={isEmptyStr(stringBody) ? 'Skip to Results' : 'Submit'}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default BlockLowerBtns;
