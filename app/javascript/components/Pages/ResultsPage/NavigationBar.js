import React from "react";
import {Calendar, EditResponse} from "../../UI/ShareContent";
import {datePrepare, isBlank, isEmpty, isPresent, rangeFormat} from "../../helpers/helpers";

const NavigationBar = ({timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod, steps, saveDataToDb, emotions, current_response}) => {
  if(isEmpty(time_periods)) return null

  const handlingBack = () => {
    if (isBlank(current_response)) return null;

    const index = steps.indexOf('productivity-check');
    const new_steps = steps.slice(0, index + 1);
    saveDataToDb( new_steps )
  }
  const isPenultimatePeriod = nextTimePeriod?.id === time_periods[0].id

  return <div className='d-flex justify-content-between position-relative' style={{marginLeft: 140, marginRight: 140, top: 50}}>
    <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
              positionLeft={true} prevTimePeriod={prevTimePeriod} emotions={emotions} />
    <Calendar date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)} onClick={showNextTimePeriod}
              positionRight={true} hidden={isBlank(nextTimePeriod)} prevTimePeriod={prevTimePeriod} emotions={emotions}/>
    <EditResponse onClick={handlingBack} hidden={nextTimePeriod} />
  </div>
}

export default NavigationBar